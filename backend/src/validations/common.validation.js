/**
 * validations/common.validation.js
 *
 * WHY THIS FILE EXISTS:
 * Bookings and enquiries both ask for a name, phone, email and city. If each
 * schema defined its own phone rule, one day they'd drift apart ("+91" works
 * on the booking form but not on the enquiry form). Shared field rules live
 * here once; feature schemas just reuse them.
 */

const { z } = require("zod");

// "" from an empty optional form field should mean "not provided".
const emptyToUndefined = (value) =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

const customerName = z
  .string({ required_error: "Name is required" })
  .trim()
  .min(2, "Name must be at least 2 characters")
  .max(80, "Name must be at most 80 characters");

// Accept "98765 43210", "+91 98765-43210", "098765..." and store just 10 digits.
const indianPhone = z
  .string({ required_error: "Phone number is required" })
  .transform((v) => v.replace(/[\s-]/g, "").replace(/^(\+91|91|0)(?=\d{10}$)/, ""))
  .pipe(z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"));

const optionalEmail = z.preprocess(
  emptyToUndefined,
  z.string().trim().toLowerCase().email("Enter a valid email address").max(254).optional()
);

const city = z
  .string({ required_error: "City is required" })
  .trim()
  .min(2, "City must be at least 2 characters")
  .max(60, "City must be at most 60 characters");

const optionalCity = z.preprocess(emptyToUndefined, city.optional());

// Builds "optional text up to N characters" (e.g. a message box).
const optionalText = (max) =>
  z.preprocess(emptyToUndefined, z.string().trim().max(max, `Must be at most ${max} characters`).optional());

// Vehicle id coming from a <select>: "3" or 3 are both fine.
const vehicleId = z.coerce
  .number({ invalid_type_error: "Please choose a vehicle" })
  .int()
  .positive("Please choose a vehicle");

// Shared paging for every admin list endpoint.
const pagination = {
  page: z.coerce.number().int().min(1).default(1),
  // WHY a max: stops a single request from pulling the whole table.
  limit: z.coerce.number().int().min(1).max(100).default(20),
};

// /:id in admin URLs
const idParams = z.object({
  id: z.coerce.number().int().positive("Id must be a positive number"),
});

module.exports = {
  emptyToUndefined,
  customerName,
  indianPhone,
  optionalEmail,
  city,
  optionalCity,
  optionalText,
  vehicleId,
  pagination,
  idParams,
};
