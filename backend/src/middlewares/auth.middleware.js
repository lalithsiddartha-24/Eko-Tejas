/**
 * middlewares/auth.middleware.js
 *
 * WHY THIS FILE EXISTS:
 * Some endpoints show private data (customer phone numbers) or change things
 * (confirming a booking). Two questions must be answered before them:
 *   1. authenticate   -> WHO are you?          (401 if we can't tell)
 *   2. requireRole()  -> are you ALLOWED here? (403 if not)
 *
 * HOW the frontend calls a protected endpoint:
 *   fetch("/api/bookings", {
 *     headers: { Authorization: `Bearer ${session.access_token}` }
 *   })
 */

const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const authService = require("../services/auth.service");

// 1. WHO are you?
const authenticate = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw ApiError.unauthorized("Please log in to continue");
  }

  // Attach the user so later middleware/controllers can use it
  // (e.g. "confirmed by req.user.email" in the future).
  req.user = await authService.getUserFromToken(token);
  next();
});

// 2. Are you ALLOWED? Usage: requireRole("admin") or requireRole("admin", "dealer")
// WHY a function that returns middleware: so one piece of code works for any
// role list, instead of writing requireAdmin, requireDealer, ...
const requireRole =
  (...allowedRoles) =>
  (req, res, next) => {
    const role = authService.getUserRole(req.user);
    if (!allowedRoles.includes(role)) {
      return next(ApiError.forbidden("You do not have permission to do this"));
    }
    next();
  };

module.exports = { authenticate, requireRole };
