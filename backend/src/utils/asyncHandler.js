/**
 * utils/asyncHandler.js
 *
 * WHY THIS FILE EXISTS:
 * Controllers are async (they await Supabase). If an awaited call throws and
 * nobody catches it, the error must still reach our error middleware.
 * Without this wrapper every controller would need its own try/catch:
 *
 *   async (req, res, next) => {
 *     try { ... } catch (err) { next(err); }   // repeated in EVERY controller
 *   }
 *
 * asyncHandler writes that try/catch once for everybody.
 *
 * NOTE: Express 5 (which we use) already forwards rejected promises to the
 * error middleware by itself. We still keep asyncHandler because:
 *   1. It makes the intent explicit when you read a controller.
 *   2. The code stays correct if it is ever copied into an Express 4 project.
 */

const asyncHandler = (requestHandler) => (req, res, next) =>
  // Promise.resolve(...) also handles a handler that is NOT async.
  // .catch(next) sends any error to the error middleware in app.js.
  Promise.resolve(requestHandler(req, res, next)).catch(next);

module.exports = asyncHandler;
