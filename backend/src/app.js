/**
 * app.js
 *
 * WHY THIS FILE EXISTS:
 * Builds and configures the Express app, but does NOT start listening.
 * WHY keep it separate from server.js:
 *   - Vercel imports this file and runs it as a serverless function (no listen).
 *   - Tests can import the app and run requests against it.
 *   - server.js only does the "open the shop door" part for local runs.
 *
 * ORDER MATTERS: Express runs middleware top to bottom for every request.
 *   security -> CORS -> body parsing -> routes -> 404 -> error handler
 */

// Load .env here too, because on Vercel server.js never runs.
require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const apiRoutes = require("./routes");
const { notFoundHandler, errorHandler } = require("./middlewares/error.middleware");

const app = express();

// 1. Security headers (blocks clickjacking, MIME sniffing, etc.)
app.use(helmet());

// 2. CORS: which websites may call this API from a browser.
// WHY: in production the frontend and API share one domain (Vercel rewrites
// /api to us), so CORS isn't needed there. Locally, Vite runs on :5173 and the
// API on :5000, so we allow the origins listed in CORS_ORIGIN.
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
app.use(cors({ origin: allowedOrigins }));

// 3. Parse JSON bodies, with a size limit.
// WHY the limit: a booking form is tiny. Rejecting huge bodies stops someone
// from slowing the server down by sending megabytes of junk.
app.use(express.json({ limit: "10kb" }));

// 4. All API routes live under /api (matches the vercel.json rewrite).
app.use("/api", apiRoutes);

// 5. Nothing matched -> JSON 404.
app.use(notFoundHandler);

// 6. Central error handler. MUST be registered last.
app.use(errorHandler);

module.exports = app;
