/**
 * tests/helpers/fakeSupabase.js
 *
 * WHY THIS FILE EXISTS:
 * Tests must not hit the real database: they'd be slow, need real keys, and
 * could write junk rows. We swap config/supabase.js for this fake BEFORE the
 * app loads. Services then talk to the fake without knowing the difference.
 *
 * Each test sets `fake.result` to what "the database" should return and then
 * checks `fake.calls` to see what query the service built.
 */

const path = require("node:path");

function installFakeSupabase() {
  const fake = { calls: [], result: { data: [], error: null } };

  // Every query-builder method records itself and returns the builder, the
  // same way supabase-js chains: from().select().eq().order()...
  const builder = new Proxy(
    {},
    {
      get(_, method) {
        if (method === "then") {
          // `await query` resolves to whatever the test configured.
          return (resolve, reject) => Promise.resolve(fake.result).then(resolve, reject);
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
      fake.calls = [["from", table]];
      return builder;
    },
  };

  // Put our fake into Node's module cache under the real file's path, so
  // require("../config/supabase") anywhere returns the fake.
  const realPath = require.resolve(path.join(__dirname, "../../src/config/supabase.js"));
  require.cache[realPath] = { id: realPath, filename: realPath, loaded: true, exports: { supabase } };

  return fake;
}

module.exports = { installFakeSupabase };
