const assert = require("node:assert/strict");
const { after, before, beforeEach, test } = require("node:test");
const { installFakeSupabase } = require("./helpers/fakeSupabase");

// Must run BEFORE requiring the app, so services pick up the fake.
const fake = installFakeSupabase();
const app = require("../src/app");

const ADMIN_TOKEN = "admin-token";

const validEnquiry = () => ({
  customer_name: "Priya Sharma",
  phone: "98480 22338",
  email: "Priya@Example.com",
  enquiry_type: "pricing",
  vehicle_id: "12",
  message: "What is the on-road price of the RUGD 120 in Vijayawada?",
});

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

const inserted = () => fake.calls.find((c) => c[0] === "insert")?.[1];

test("customer sends an enquiry: 201 with a reference id, data cleaned", async () => {
  const saved = { id: 12, enquiry_type: "pricing", status: "new" };
  fake.queue(
    { data: { id: 12, name: "RUGD 120" }, error: null }, // vehicle exists
    { data: null, error: null }, // no recent duplicate
    { data: saved, error: null } // insert
  );

  const { status, body } = await call("POST", "/api/enquiries", { body: validEnquiry() });

  assert.equal(status, 201);
  assert.deepEqual(body.data, saved);
  const row = inserted();
  assert.equal(row.phone, "9848022338");
  assert.equal(row.email, "priya@example.com");
  assert.equal(row.vehicle_id, 12); // "12" coerced to a number
  assert.equal("status" in row, false);
});

test("vehicle is optional and type defaults to general", async () => {
  fake.queue({ data: null, error: null }, { data: { id: 1 }, error: null });
  const { customer_name, phone, message } = validEnquiry();

  const { status } = await call("POST", "/api/enquiries", {
    body: { customer_name, phone, message, vehicle_id: "" },
  });

  assert.equal(status, 201);
  assert.equal(inserted().enquiry_type, "general");
  assert.equal(inserted().vehicle_id, null);
  // No vehicle lookup happened.
  assert.ok(!fake.calls.some((c) => c[0] === "from" && c[1] === "vehicles"));
});

test("honeypot filled: same 201 reply, but nothing is saved", async () => {
  const { status, body } = await call("POST", "/api/enquiries", {
    body: { ...validEnquiry(), website: "http://spam.example" },
  });

  assert.equal(status, 201);
  assert.equal(body.message, "Thank you! Our team will get back to you within 24 hours.");
  assert.equal(fake.calls.length, 0);
});

test("same enquiry again within 10 minutes returns the existing one, no new row", async () => {
  const existing = { id: 5, enquiry_type: "pricing", status: "new" };
  fake.queue({ data: { id: 12 }, error: null }, { data: existing, error: null });

  const { status, body } = await call("POST", "/api/enquiries", { body: validEnquiry() });

  assert.equal(status, 201);
  assert.deepEqual(body.data, existing);
  assert.equal(inserted(), undefined);
});

test("invalid enquiry returns 400 per field and never touches the DB", async () => {
  const { status, body } = await call("POST", "/api/enquiries", {
    body: { customer_name: "P", phone: "123", message: "hi", enquiry_type: "loan" },
  });

  assert.equal(status, 400);
  const fields = body.errors.map((e) => e.field).sort();
  assert.deepEqual(fields, ["customer_name", "enquiry_type", "message", "phone"]);
  assert.equal(fake.calls.length, 0);
});

test("unknown vehicle returns 400 on vehicle_id", async () => {
  fake.queue({ data: null, error: null });
  const { status, body } = await call("POST", "/api/enquiries", {
    body: { ...validEnquiry(), vehicle_id: 999 },
  });
  assert.equal(status, 400);
  assert.equal(body.errors[0].field, "vehicle_id");
});

test("admin endpoints need a token", async () => {
  assert.equal((await call("GET", "/api/enquiries")).status, 401);
});

test("admin lists enquiries filtered by status and type", async () => {
  fake.queue({ data: [], error: null, count: 0 });

  const { status, body } = await call("GET", "/api/enquiries?status=new&type=pricing", { token: ADMIN_TOKEN });

  assert.equal(status, 200);
  assert.deepEqual(body.data.pagination, { page: 1, limit: 20, total: 0, totalPages: 0 });
  assert.ok(fake.calls.some((c) => c[0] === "eq" && c[1] === "enquiry_type" && c[2] === "pricing"));
});

test("admin marks a new enquiry as contacted", async () => {
  fake.queue({ data: { id: 3, status: "new" }, error: null }, { data: { id: 3, status: "contacted" }, error: null });

  const { status, body } = await call("PATCH", "/api/enquiries/3/status", {
    token: ADMIN_TOKEN,
    body: { status: "contacted" },
  });

  assert.equal(status, 200);
  assert.equal(body.message, "Enquiry marked as contacted");
});

test("a closed enquiry cannot be reopened", async () => {
  fake.queue({ data: { id: 3, status: "closed" }, error: null });

  const { status } = await call("PATCH", "/api/enquiries/3/status", {
    token: ADMIN_TOKEN,
    body: { status: "new" },
  });
  assert.equal(status, 409);
});
