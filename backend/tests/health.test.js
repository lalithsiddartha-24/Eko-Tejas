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

test("health endpoint is public and returns service status", async () => {
  const response = await fetch(`${server.url}/api/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    success: true,
    status: "ok",
    service: "ekotejas-backend",
  });
});

test("unknown API routes return a consistent JSON error", async () => {
  const response = await fetch(`${server.url}/api/not-a-route`);
  assert.equal(response.status, 404);
  assert.deepEqual(await response.json(), {
    success: false,
    message: "Route not found",
    error: "NOT_FOUND",
  });
});
