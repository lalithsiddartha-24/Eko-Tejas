const { createApp } = require("../createApp");

const seedVehicles = [
  { id: 1, name: "City Scooter", category: "two-wheeler", range: "100" },
  { id: 2, name: "Cargo EV", category: "three-wheeler", range: "80" },
];
const seedPresentations = [
  { "Vehicle Name": "City Scooter", description: "Urban electric scooter" },
];

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function createQuery({ rows, table, adminUsers }) {
  const state = { operation: "select", filters: [], payload: undefined };
  const query = {
    select() {
      return query;
    },
    eq(column, value) {
      state.filters.push((row) => row[column] === value);
      return query;
    },
    order(column, { ascending }) {
      return execute().then(({ data, error }) => ({
        data: data?.sort((left, right) =>
          ascending
            ? left[column] - right[column]
            : right[column] - left[column]
        ),
        error,
      }));
    },
    insert(payload) {
      state.operation = "insert";
      state.payload = payload;
      return query;
    },
    update(payload) {
      state.operation = "update";
      state.payload = payload;
      return query;
    },
    delete() {
      state.operation = "delete";
      return query;
    },
    async maybeSingle() {
      const { data, error } = await execute();
      return { data: data?.[0] || null, error };
    },
    then(resolve, reject) {
      return execute().then(resolve, reject);
    },
  };

  function execute() {
    const collection = table === "admin_users" ? adminUsers : rows[table] || [];
    if (state.operation === "insert") {
      const inserted = state.payload.map((record, index) => ({
        id:
          record.id ??
          Math.max(0, ...collection.map((row) => Number(row.id) || 0)) +
            index +
            1,
        ...record,
      }));
      collection.push(...inserted);
      return Promise.resolve({ data: clone(inserted), error: null });
    }

    const matched = collection.filter((row) =>
      state.filters.every((filter) => filter(row))
    );
    if (state.operation === "update") {
      matched.forEach((row) => Object.assign(row, clone(state.payload)));
      return Promise.resolve({ data: clone(matched), error: null });
    }
    if (state.operation === "delete") {
      const matchedSet = new Set(matched);
      rows[table] = collection.filter((row) => !matchedSet.has(row));
      return Promise.resolve({ data: clone(matched), error: null });
    }
    return Promise.resolve({ data: clone(matched), error: null });
  }

  return query;
}

function createTestClients() {
  const state = {
    rows: {
      vehicles: clone(seedVehicles),
      "All vehicles": clone(seedPresentations),
    },
    adminUsers: [
      { id: "active-admin", is_active: true },
      { id: "inactive-admin", is_active: false },
    ],
  };
  const databaseClient = {
    from(table) {
      return createQuery({
        rows: state.rows,
        table,
        adminUsers: state.adminUsers,
      });
    },
  };
  const authClient = {
    auth: {
      async getUser(token) {
        if (token === "active.token.value") {
          return { data: { user: { id: "active-admin" } }, error: null };
        }
        if (token === "inactive.token.value") {
          return { data: { user: { id: "inactive-admin" } }, error: null };
        }
        if (token === "user.token.value") {
          return { data: { user: { id: "regular-user" } }, error: null };
        }
        if (token === "expired.token.value") {
          return {
            data: { user: null },
            error: { status: 401, message: "Expired token" },
          };
        }
        return {
          data: { user: null },
          error: { status: 401, message: "Invalid token" },
        };
      },
    },
  };

  return { clients: { authClient, databaseClient }, state };
}

async function startTestServer() {
  const { clients, state } = createTestClients();
  const app = createApp(clients);
  const server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  const { port } = server.address();

  return {
    state,
    url: `http://127.0.0.1:${port}`,
    async close() {
      await new Promise((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve()))
      );
    },
  };
}

module.exports = { startTestServer };
