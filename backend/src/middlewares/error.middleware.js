/**
 * middlewares/error.middleware.js
 *
 * WHY THIS FILE EXISTS:
 * This is the ONE place where errors become HTTP responses. Services just
 * `throw`. Controllers don't catch. Everything lands here, so:
 *   - every error response has the same JSON shape
 *   - real crash details (Supabase internals, stack traces) are logged on the
 *     server but never leaked to the customer's browser
 */

const ApiError = require("../utils/ApiError");

// 404 for any /api URL that no route matched.
// WHY: without this, Express replies with an HTML page, and the frontend's
// readApiJson would fail with "non-JSON response".
const notFoundHandler = (req, res, next) => {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
};

// WHY 4 parameters: Express recognises an error middleware ONLY by its
// signature (err, req, res, next). Removing `next` would silently break it.
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // Malformed JSON in the request body (e.g. a missing quote) -> 400, not 500.
  if (err.type === "entity.parse.failed") {
    err = ApiError.badRequest("Request body is not valid JSON");
  }

  const isExpected = err instanceof ApiError && err.isOperational;
  const statusCode = isExpected ? err.statusCode : 500;

  // Log unexpected errors fully so we can debug them in the terminal / Vercel logs.
  if (!isExpected) {
    console.error(`[ERROR] ${req.method} ${req.originalUrl}`, err);
  }

  res.status(statusCode).json({
    success: false,
    // WHY: an unexpected error message may contain table names or SQL hints.
    // The customer only gets a generic message.
    message: isExpected ? err.message : "Something went wrong. Please try again.",
    errors: isExpected ? err.errors : [],
    // Stack traces help during development but must never appear in production.
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = { notFoundHandler, errorHandler };
