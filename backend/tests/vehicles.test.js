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

test("public vehicle listing and presentation keep their response contracts", async () => {
  const allResponse = await fetch(`${server.url}/api/vehicles`);
  assert.equal(allResponse.status, 200);
  const allList = await allResponse.json();
  assert.equal(allList.success, true);
  assert.equal(allList.data.length, 2);

  const twoWheelerResponse = await fetch(
    `${server.url}/api/vehicles?category=two-wheeler`
  );
  assert.equal(twoWheelerResponse.status, 200);
  const twoList = await twoWheelerResponse.json();
  assert.deepEqual(Object.keys(twoList).sort(), ["data", "success"]);
  assert.equal(twoList.data.length, 1);
  assert.equal(twoList.data[0].name, "City Scooter");
  assert.equal(twoList.data[0].category, "two-wheeler");

  const threeWheelerResponse = await fetch(
    `${server.url}/api/vehicles?category=three-wheeler`
  );
  assert.equal(threeWheelerResponse.status, 200);
  const threeList = await threeWheelerResponse.json();
  assert.equal(threeList.success, true);
  assert.equal(threeList.data.length, 1);
  assert.equal(threeList.data[0].name, "Cargo EV");
  assert.equal(threeList.data[0].category, "three-wheeler");

  const normalizedResponse = await fetch(
    `${server.url}/api/vehicles?category=two-wheelers`
  );
  assert.equal(normalizedResponse.status, 200);
  const normalizedList = await normalizedResponse.json();
  assert.equal(normalizedList.data.length, 1);
  assert.equal(normalizedList.data[0].name, "City Scooter");

  const presentationResponse = await fetch(
    `${server.url}/api/vehicle-presentations/City%20Scooter`
  );
  assert.equal(presentationResponse.status, 200);
  const presentation = await presentationResponse.json();
  assert.deepEqual(Object.keys(presentation).sort(), ["success", "vehicle"]);
  assert.equal(presentation.vehicle["Vehicle Name"], "City Scooter");
});

test("active admin can create, read, update, and delete a vehicle", async () => {
  const headers = {
    authorization: "Bearer active.token.value",
    "content-type": "application/json",
  };
  const createResponse = await fetch(`${server.url}/api/vehicles`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      name: "Lifecycle Test Vehicle",
      category: "three-wheeler",
    }),
  });
  assert.equal(createResponse.status, 201);
  const created = (await createResponse.json()).vehicle;

  const readResponse = await fetch(`${server.url}/api/vehicles`);
  const readPayload = await readResponse.json();
  assert.ok(readPayload.data.some((vehicle) => vehicle.name === created.name));

  const updateResponse = await fetch(
    `${server.url}/api/vehicles/${created.id}`,
    {
      method: "PUT",
      headers,
      body: JSON.stringify({ name: "Updated Test Vehicle" }),
    }
  );
  assert.equal(updateResponse.status, 200);
  assert.equal((await updateResponse.json()).vehicle.name, "Updated Test Vehicle");

  const deleteResponse = await fetch(
    `${server.url}/api/vehicles/${created.id}`,
    { method: "DELETE", headers }
  );
  assert.equal(deleteResponse.status, 200);
  assert.equal((await deleteResponse.json()).vehicle.name, "Updated Test Vehicle");

  const finalRead = await fetch(`${server.url}/api/vehicles`);
  const finalPayload = await finalRead.json();
  assert.ok(
    finalPayload.data.every((vehicle) => vehicle.name !== "Updated Test Vehicle")
  );
});

test("invalid vehicle payload is rejected without changing records", async () => {
  const before = structuredClone(server.state.rows.vehicles);
  const response = await fetch(`${server.url}/api/vehicles`, {
    method: "POST",
    headers: {
      authorization: "Bearer active.token.value",
      "content-type": "application/json",
    },
    body: JSON.stringify({}),
  });

  assert.equal(response.status, 400);
  assert.deepEqual(server.state.rows.vehicles, before);
});
