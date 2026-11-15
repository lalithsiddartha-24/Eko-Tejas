const assert = require("node:assert/strict");
const { after, before, beforeEach, test } = require("node:test");
const { installFakeSupabase } = require("./helpers/fakeSupabase");
const { todayInBusinessTimeZone, addDays } = require("../src/utils/date");

// Must run BEFORE requiring the app, so services pick up the fake.
const fake = installFakeSupabase();
const app = require("../src/app");

const vehicle = { id: 3, name: "Axel Pro", category: "two-wheeler" };
const tomorrow = addDays(todayInBusinessTimeZone(), 1);

const validBooking = () => ({
  vehicle_id: 3,
  customer_name: "  Ravi Kumar ",
  phone: "+91 98765-43210",
  email: "",
  city: "Hyderabad",
  preferred_date: tomorrow,
  preferred_time_slot: "morning",
});

const ADMIN_TOKEN = "admin-token";
const CUSTOMER_TOKEN = "customer-token";

let server;
let baseUrl;

before(async () => {
  server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(() => new Promise((resolve) => server.close(resolve)));

beforeEach(() => {
  fake.reset();
  fake.users[ADMIN_TOKEN] = { id: "u1", app_metadata: { role: "admin" } };
  fake.users[CUSTOMER_TOKEN] = { id: "u2", app_metadata: {} };
});

async function call(method, path, { body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return { status: response.status, body: await response.json() };
}

// ---------- POST /api/bookings (public) ----------

test("customer books a test drive: 201, cleaned data inserted, status not taken from input", async () => {
  const created = { id: 10, preferred_date: tomorrow, preferred_time_slot: "morning", status: "pending", vehicle };
  fake.queue(
    { data: vehicle, error: null }, // vehicleService.getVehicleById
    { data: created, error: null } // insert
  );

  const { status, body } = await call("POST", "/api/bookings", { body: validBooking() });

  assert.equal(status, 201);
  assert.deepEqual(body.data, created);

  const insert = fake.calls.find((c) => c[0] === "insert")[1];
  assert.equal(insert.customer_name, "Ravi Kumar"); // trimmed
  assert.equal(insert.phone, "9876543210"); // +91, spaces, dash removed
  assert.equal(insert.email, null); // "" -> null
  assert.equal("status" in insert, false); // DB default 'pending' decides
});

test("invalid form returns 400 with a message per field and never touches the DB", async () => {
  const { status, body } = await call("POST", "/api/bookings", {
    body: { ...validBooking(), phone: "12345", preferred_date: "2020-01-01", preferred_time_slot: "night" },
  });

  assert.equal(status, 400);
  const fields = body.errors.map((e) => e.field).sort();
  assert.deepEqual(fields, ["phone", "preferred_date", "preferred_time_slot"]);
  assert.equal(fake.calls.length, 0);
});

test("a customer cannot sneak in status: confirmed", async () => {
  const { status, body } = await call("POST", "/api/bookings", {
    body: { ...validBooking(), status: "confirmed" },
  });
  assert.equal(status, 400);
  assert.deepEqual(body.errors, [{ field: "status", message: '"status" is not allowed' }]);
});

test("dates more than 60 days ahead are rejected", async () => {
  const { status, body } = await call("POST", "/api/bookings", {
    body: { ...validBooking(), preferred_date: addDays(todayInBusinessTimeZone(), 61) },
  });
  assert.equal(status, 400);
  assert.equal(body.errors[0].field, "preferred_date");
});

test("booking a vehicle that doesn't exist returns 400 on vehicle_id", async () => {
  fake.queue({ data: null, error: null }); // vehicle lookup finds nothing

  const { status, body } = await call("POST", "/api/bookings", { body: { ...validBooking(), vehicle_id: 999 } });

  assert.equal(status, 400);
  assert.deepEqual(body.errors, [{ field: "vehicle_id", message: "Selected vehicle does not exist" }]);
});

test("duplicate active booking (unique index) returns 409", async () => {
  fake.queue({ data: vehicle, error: null }, { data: null, error: { code: "23505", message: "duplicate key" } });

  const { status, body } = await call("POST", "/api/bookings", { body: validBooking() });

  assert.equal(status, 409);
  assert.equal(body.message, "You already have a test drive booked for this vehicle on that date");
});

// ---------- Admin endpoints ----------

test("listing bookings without a token returns 401", async () => {
  const { status } = await call("GET", "/api/bookings");
  assert.equal(status, 401);
});

test("listing bookings with an invalid token returns 401", async () => {
  const { status } = await call("GET", "/api/bookings", { token: "forged" });
  assert.equal(status, 401);
});

test("a logged-in non-admin gets 403", async () => {
  const { status } = await call("GET", "/api/bookings", { token: CUSTOMER_TOKEN });
  assert.equal(status, 403);
  assert.equal(fake.calls.length, 0);
});

test("admin lists bookings with paging and status filter", async () => {
  fake.queue({ data: [{ id: 1 }], error: null, count: 45 });

  const { status, body } = await call("GET", "/api/bookings?status=pending&page=2&limit=20", { token: ADMIN_TOKEN });

  assert.equal(status, 200);
  assert.deepEqual(body.data.pagination, { page: 2, limit: 20, total: 45, totalPages: 3 });
  assert.ok(fake.calls.some((c) => c[0] === "range" && c[1] === 20 && c[2] === 39));
  assert.ok(fake.calls.some((c) => c[0] === "eq" && c[1] === "status" && c[2] === "pending"));
});

test("admin confirms a pending booking", async () => {
  fake.queue(
    { data: { id: 7, status: "pending" }, error: null }, // getBookingById
    { data: { id: 7, status: "confirmed" }, error: null } // update
  );

  const { status, body } = await call("PATCH", "/api/bookings/7/status", {
    token: ADMIN_TOKEN,
    body: { status: "confirmed" },
  });

  assert.equal(status, 200);
  assert.equal(body.message, "Booking marked as confirmed");
  // Optimistic concurrency: update only if still 'pending'.
  assert.ok(fake.calls.some((c) => c[0] === "eq" && c[1] === "status" && c[2] === "pending"));
});

test("a completed booking cannot be reopened (409)", async () => {
  fake.queue({ data: { id: 7, status: "completed" }, error: null });

  const { status, body } = await call("PATCH", "/api/bookings/7/status", {
    token: ADMIN_TOKEN,
    body: { status: "pending" },
  });

  assert.equal(status, 409);
  assert.equal(body.message, "Cannot change a completed booking to pending");
});

test("if another admin changed it first, the update returns 409", async () => {
  fake.queue(
    { data: { id: 7, status: "pending" }, error: null },
    { data: null, error: null } // no row still had status 'pending'
  );

  const { status } = await call("PATCH", "/api/bookings/7/status", {
    token: ADMIN_TOKEN,
    body: { status: "cancelled" },
  });
  assert.equal(status, 409);
});

test("unknown booking id returns 404", async () => {
  fake.queue({ data: null, error: null });
  const { status } = await call("GET", "/api/bookings/12345", { token: ADMIN_TOKEN });
  assert.equal(status, 404);
});
