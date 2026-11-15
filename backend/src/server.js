/**
 * server.js
 *
 * WHY THIS FILE EXISTS:
 * Starts the HTTP server on your machine (npm run dev / npm start).
 * On Vercel this file is NOT used: Vercel imports src/app.js directly.
 */

const app = require("./app");

// Importing the Supabase config here makes a missing key crash at startup
// with a clear message, instead of on the first customer request.
require("./config/supabase");

const PORT = Number(process.env.PORT) || 5000;

const server = app.listen(PORT, () => {
  console.log(`Eko Tejas API running on http://localhost:${PORT}`);
});

// WHY: a promise error that nothing caught means the app is in an unknown
// state. Log it and exit; nodemon (dev) or the host (prod) restarts us cleanly.
process.on("unhandledRejection", (reason) => {
  console.error("[FATAL] Unhandled promise rejection:", reason);
  server.close(() => process.exit(1));
});
