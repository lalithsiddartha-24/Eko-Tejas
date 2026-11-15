/**
 * validations/vehicle.validation.js
 *
 * WHY THIS FILE EXISTS:
 * The rules for what a valid vehicle request looks like live here, in one
 * place. Routes plug these schemas into the validate() middleware. Controllers
 * and services can then trust the input completely.
 */

const { z } = require("zod");

// Single source of truth for allowed categories.
// WHY export it: the service and future admin APIs reuse the same list.
const VEHICLE_CATEGORIES = ["two-wheeler", "three-wheeler"];

// GET /api/vehicles?category=two-wheeler
const listVehiclesQuery = z.object({
  category: z
    .string()
    .trim()
    .toLowerCase() // "Two-Wheeler" in the URL still works
    .pipe(
      z.enum(VEHICLE_CATEGORIES, {
        errorMap: () => ({ message: "Category must be two-wheeler or three-wheeler" }),
      })
    )
    .optional(), // no category = list every vehicle
});

// GET /api/vehicles/:name   e.g. /api/vehicles/Axel%20Pro
// Express already decodes %20 back to a space before we see it.
const vehicleNameParams = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Vehicle name is required")
    .max(100, "Vehicle name is too long"), // stops absurdly long junk input
});

module.exports = { VEHICLE_CATEGORIES, listVehiclesQuery, vehicleNameParams };
