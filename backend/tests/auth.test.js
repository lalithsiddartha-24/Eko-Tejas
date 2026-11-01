const { after, before, test } = require("node:test");
const assert = require("node:assert/strict");
const { startTestServer } = require("./helpers");

let server;

before(async () => {
  server = await startTestServer();
});

after(async () => {
  await server.close();
});

test("missing, malformed, invalid, and unauthorized credentials cannot mutate vehicles", async () => {
  const originalVehicles = structuredClone(server.state.rows.vehicles);
  const credentials = [
    { headers: {}, status: 401 },
    { headers: { authorization: "Bearer not-a-jwt" }, status: 401 },
    { headers: { authorization: "Bearer invalid.token.value" }, status: 401 },
    { headers: { authorization: "Bearer expired.token.value" }, status: 401 },
    { headers: { authorization: "Bearer user.token.value" }, status: 403 },
    { headers: { authorization: "Bearer inactive.token.value" }, status: 403 },
  ];

  for (const method of ["POST", "PUT", "DELETE"]) {
    for (const { headers, status } of credentials) {
      const response = await fetch(
        `${server.url}/api/vehicles${method === "POST" ? "" : "/1"}`,
        {
          method,
          headers: { "content-type": "application/json", ...headers },
          body:
            method === "DELETE"
              ? undefined
              : JSON.stringify({ name: "Unauthorized vehicle" }),
        }
      );
      assert.equal(response.status, status);
      const payload = await response.json();
      assert.equal(payload.success, false);
    }
  }

  assert.deepEqual(server.state.rows.vehicles, originalVehicles);
});

test("active admin token is verified and allows a vehicle operation", async () => {
  const response = await fetch(`${server.url}/api/vehicles`, {
    method: "POST",
    headers: {
      authorization: "Bearer active.token.value",
      "content-type": "application/json",
    },
    body: JSON.stringify({ name: "Admin Test Vehicle", category: "two-wheeler" }),
  });

  assert.equal(response.status, 201);
  assert.equal((await response.json()).vehicle.name, "Admin Test Vehicle");
});
