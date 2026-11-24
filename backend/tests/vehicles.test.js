const assert = require("node:assert/strict");
const { after, before, beforeEach, test } = require("node:test");
const { installFakeSupabase } = require("./helpers/fakeSupabase");

// Must run BEFORE requiring the app, so services pick up the fake.
const fake = installFakeSupabase();
const app = require("../src/app");

const axel = {
  id: 1,
  name: "Axel",
  category: "two-wheeler",
  tagline: "Everyday Freedom",
  range: "120 km",
  power: "3.5 kW",
  image: "",
};

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
  fake.result = { data: [axel], error: null };
});

const get = async (path) => {
  const response = await fetch(`${baseUrl}${path}`);
  return { status: response.status, body: await response.json() };
};

test("GET /api/health works", async () => {
  const { status, body } = await get("/api/health");
  assert.equal(status, 200);
  assert.equal(body.success, true);
});

test("GET /api/vehicles?category=two-wheeler filters by category", async () => {
  const { status, body } = await get("/api/vehicles?category=Two-Wheeler");

  assert.equal(status, 200);
  assert.deepEqual(body, { success: true, message: "Vehicles fetched", data: [axel] });
  assert.deepEqual(fake.calls[0], ["from", "vehicles"]);
  // Zod lower-cased "Two-Wheeler" before it reached the service.
  assert.ok(fake.calls.some((c) => c[0] === "eq" && c[1] === "category" && c[2] === "two-wheeler"));
});

test("GET /api/vehicles without category returns all and does not filter", async () => {
  const { status } = await get("/api/vehicles");
  assert.equal(status, 200);
  assert.ok(!fake.calls.some((c) => c[0] === "eq"));
});

test("GET /api/vehicles rejects an unknown category with 400 before touching the DB", async () => {
  const { status, body } = await get("/api/vehicles?category=truck");

  assert.equal(status, 400);
  assert.equal(body.message, "Validation failed");
  assert.equal(body.errors[0].field, "category");
  assert.equal(fake.calls.length, 0);
});

test("GET /api/vehicles/:name returns one vehicle by exact name", async () => {
  fake.result = { data: axel, error: null };
  const { status, body } = await get(`/api/vehicles/${encodeURIComponent("Axel")}`);

  assert.equal(status, 200);
  // No spec sheet in the fake row -> an empty object, not an error.
  assert.deepEqual(body.data, { ...axel, specifications: {} });
  assert.ok(fake.calls.some((c) => c[0] === "eq" && c[1] === "name" && c[2] === "Axel"));
});

test("GET /api/vehicles/:name includes the spec sheet, without empty fields", async () => {
  fake.result = {
    data: {
      ...axel,
      specifications: { top_speed: "25 km/h", brakes: "Disc", cargo_dimensions: null, lighting: "  " },
    },
    error: null,
  };
  const { status, body } = await get("/api/vehicles/Axel");

  assert.equal(status, 200);
  // null and blank values are dropped: scooters and 3-wheelers fill different columns.
  assert.deepEqual(body.data.specifications, { top_speed: "25 km/h", brakes: "Disc" });
});

test("the detail query embeds vehicle_specifications but never asks for internal notes", async () => {
  fake.result = { data: axel, error: null };
  await get("/api/vehicles/Axel");

  const select = fake.calls.find((c) => c[0] === "select")[1];
  assert.match(select, /specifications:vehicle_specifications\(/);
  // specification_notes is a staff-only note ("verify before publishing").
  assert.ok(!select.includes("specification_notes"));
});

test("GET /api/vehicles/:name returns 404 when no vehicle matches", async () => {
  fake.result = { data: null, error: null };
  const { status, body } = await get("/api/vehicles/Nope");

  assert.equal(status, 404);
  assert.equal(body.success, false);
  assert.equal(body.message, 'Vehicle "Nope" not found');
});

test("a database error becomes a generic 500 without leaking details", async () => {
  fake.result = { data: null, error: { message: 'relation "vehicles" does not exist' } };
  const { status, body } = await get("/api/vehicles");

  assert.equal(status, 500);
  // The service replaced the raw Supabase error with its own safe message.
  assert.equal(body.message, "Could not load vehicles");
  assert.ok(!JSON.stringify(body).includes("relation"));
});
