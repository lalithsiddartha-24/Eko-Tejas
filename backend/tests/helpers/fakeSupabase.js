/**
 * tests/helpers/fakeSupabase.js
 *
 * WHY THIS FILE EXISTS:
 * Tests must not hit the real database: they'd be slow, need real keys, and
 * could write junk rows. We swap config/supabase.js for this fake BEFORE the
 * app loads. Services then talk to the fake without knowing the difference.
 *
 * In a test:
 *   fake.queue(result1, result2)  -> what each `await query` returns, in order
 *                                    (one request can run several queries)
 *   fake.result = {...}           -> fallback when the queue is empty
 *   fake.users[token] = user      -> which tokens auth.getUser() accepts
 *   fake.calls                    -> every builder call, to check the query
 */

const path = require("node:path");

function installFakeSupabase() {
  const fake = {
    calls: [],
    pending: [],
    result: { data: [], error: null },
    users: {},
    queue(...results) {
      this.pending.push(...results);
    },
    reset() {
      this.calls = [];
      this.pending = [];
      this.result = { data: [], error: null };
      this.users = {};
    },
  };

  // Every query-builder method records itself and returns the builder, the
  // same way supabase-js chains: from().select().eq().order()...
  const builder = new Proxy(
    {},
    {
      get(_, method) {
        if (method === "then") {
          // `await query` resolves to the next queued result (or the fallback).
          return (resolve, reject) => {
            const next = fake.pending.length ? fake.pending.shift() : fake.result;
            return Promise.resolve(next).then(resolve, reject);
          };
        }
        return (...args) => {
          fake.calls.push([method, ...args]);
          return builder;
        };
      },
    }
  );

  const supabase = {
    from(table) {
      fake.calls.push(["from", table]);
      return builder;
    },
    auth: {
      async getUser(token) {
        const user = fake.users[token];
        return user
          ? { data: { user }, error: null }
          : { data: { user: null }, error: { message: "invalid JWT" } };
      },
    },
  };

  // Put our fake into Node's module cache under the real file's path, so
  // require("../config/supabase") anywhere returns the fake.
  const realPath = require.resolve(path.join(__dirname, "../../src/config/supabase.js"));
  require.cache[realPath] = { id: realPath, filename: realPath, loaded: true, exports: { supabase } };

  return fake;
}

module.exports = { installFakeSupabase };
