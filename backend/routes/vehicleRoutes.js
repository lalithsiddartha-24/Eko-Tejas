const express = require("express");
const { authenticateUser, authorizeAdmin } = require("../middleware/authMiddleware");
const { createVehicleController } = require("../controllers/vehicleController");

function createVehicleRoutes({ authClient, databaseClient, presentationTable }) {
  const router = express.Router();
  const controller = createVehicleController(databaseClient, presentationTable);
  const requireAdmin = [
    authenticateUser(authClient),
    authorizeAdmin(databaseClient),
  ];

  router.get("/vehicles", controller.listVehicles);
  router.get(
    "/vehicle-presentations/:vehicleName",
    controller.getVehiclePresentation
  );
  router.post("/vehicles", ...requireAdmin, controller.createVehicle);
  router.put("/vehicles/:id", ...requireAdmin, controller.updateVehicle);
  router.delete("/vehicles/:id", ...requireAdmin, controller.deleteVehicle);

  return router;
}

module.exports = { createVehicleRoutes };
