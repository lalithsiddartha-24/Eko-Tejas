/**
 * routes/vehicle.routes.js
 *
 * WHY THIS FILE EXISTS:
 * Maps URLs to controllers, with validation in between. ONLY routing here.
 * Reading this file tells you exactly what the vehicle API offers and which
 * checks each endpoint runs, without reading any logic.
 *
 * Mounted at /api/vehicles in routes/index.js.
 */

const { Router } = require("express");
const validate = require("../middlewares/validation.middleware");
const { listVehiclesQuery, vehicleNameParams } = require("../validations/vehicle.validation");
const vehicleController = require("../controllers/vehicle.controller");

const router = Router();

// Public: anyone browsing the showroom can see vehicles, so no auth middleware.
router.get("/", validate({ query: listVehiclesQuery }), vehicleController.listVehicles);
router.get("/:name", validate({ params: vehicleNameParams }), vehicleController.getVehicleByName);

module.exports = router;
