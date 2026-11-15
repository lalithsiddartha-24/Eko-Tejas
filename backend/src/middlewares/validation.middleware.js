/**
 * middlewares/validation.middleware.js
 *
 * WHY THIS FILE EXISTS:
 * Never trust data coming from the browser. Someone can send
 * { phone: "abc", preferred_date: "yesterday" } straight to our API with
 * Postman or curl, skipping the frontend form completely.
 *
 * This middleware checks the request against a Zod schema BEFORE the
 * controller runs. Bad data gets a 400 response and never reaches the
 * service or the database.
 *
 * USAGE in a route file:
 *   router.post("/", validate({ body: createBookingSchema }), createBooking);
 */

const { ZodError } = require("zod");
const ApiError = require("../utils/ApiError");

/**
 * @param {{ body?: import("zod").ZodTypeAny,
 *           query?: import("zod").ZodTypeAny,
 *           params?: import("zod").ZodTypeAny }} schemas
 */
const validate = (schemas) => (req, res, next) => {
  try {
    // WHY we keep the PARSED result (not the raw input):
    // Zod also cleans the data: trims spaces, converts "5" to 5, removes keys
    // we did not declare. The controller only ever sees clean, trusted data.
    if (schemas.body) {
      req.body = schemas.body.parse(req.body ?? {});
    }
    if (schemas.params) {
      req.params = schemas.params.parse(req.params);
    }
    if (schemas.query) {
      // WHY a new property: in Express 5, `req.query` is a read-only getter,
      // so we can't overwrite it. Controllers read `req.validatedQuery`.
      req.validatedQuery = schemas.query.parse(req.query);
    }
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      // Turn Zod's detailed report into a simple list the frontend can show
      // next to each form field: [{ field: "phone", message: "..." }]
      const errors = error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));
      return next(ApiError.badRequest("Validation failed", errors));
    }
    next(error);
  }
};

module.exports = validate;
