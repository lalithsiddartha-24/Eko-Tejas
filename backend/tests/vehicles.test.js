const assert = require("node:assert/strict");
const { after, before, test } = require("node:test");
const { createApp } = require("../app");

const vehicles = [
  {
    name: "Axel",
    category: "two-wheeler",
    tagline: "Everyday Freedom",
    range: "120 km",
    power: "3.5 kW",
    image: "",
  },
];

function createSupabaseMock() {
  const calls = {};
  const query = {
    select(fields) {
      calls.fields = fields;
      return query;
    },
    order(field, options) {
      calls.order = { field, options };
      return query;
    },
    eq(field, value) {
      calls.filter = { field, value };
      return query;
    },
    then(resolve, reject) {
      return Promise.resolve({ data: vehicles, error: null }).then(
        resolve,
        reject
      );
    },
  };

  return {
    calls,
    client: {
      from(table) {
        calls.table = table;
        return query;
      },
    },
  };
}

let server;
let baseUrl;
let supabase;

before(async () => {
  supabase = createSupabaseMock();
  server = createApp({ getSupabaseClient: () => supabase.client }).listen(
    0,
    "127.0.0.1"
  );
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
});

test("GET /api/vehicles returns vehicles in the frontend API format", async () => {
  const response = await fetch(`${baseUrl}/api/vehicles?category=two-wheeler`);

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { success: true, data: vehicles });
  assert.equal(supabase.calls.table, "vehicles");
  assert.deepEqual(supabase.calls.filter, {
    field: "category",
    value: "two-wheeler",
  });
});

test("GET /api/vehicles rejects unsupported categories", async () => {
  const response = await fetch(`${baseUrl}/api/vehicles?category=unknown`);

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    success: false,
    message: "Category must be two-wheeler or three-wheeler",
  });
});
