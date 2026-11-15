/**
 * controllers/vehicle.controller.js
 *
 * WHY THIS FILE EXISTS:
 * Controllers are the thin "front desk": take the (already validated) input
 * from req, hand it to the service, and send the result with ApiResponse.
 *
 * RULES followed here:
 *   - NO Supabase calls (that's the service's job)
 *   - NO try/catch (asyncHandler + error middleware handle errors)
 *   - NO validation (validate() middleware already ran in the route)
 */

const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const vehicleService = require("../services/vehicle.service");

// GET /api/vehicles?category=two-wheeler
const listVehicles = asyncHandler(async (req, res) => {
  // validatedQuery (not req.query) holds the cleaned, Zod-checked values.
  const vehicles = await vehicleService.listVehicles(req.validatedQuery);
  new ApiResponse(200, vehicles, "Vehicles fetched").send(res);
});

// GET /api/vehicles/:name
const getVehicleByName = asyncHandler(async (req, res) => {
  const vehicle = await vehicleService.getVehicleByName(req.params.name);
  new ApiResponse(200, vehicle, "Vehicle fetched").send(res);
});

module.exports = { listVehicles, getVehicleByName };
