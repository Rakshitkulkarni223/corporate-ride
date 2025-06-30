const express = require("express");
const { vehicleController } = require("../controller");
const authenticateUser = require("../middleware/authMiddleware");

const vehicleRouter = express.Router();

vehicleRouter.post("/create", authenticateUser, vehicleController.createVehicle);
vehicleRouter.get("/", authenticateUser, vehicleController.getMyVehicle);
vehicleRouter.put("/:id/update", authenticateUser, vehicleController.updateVehicle);

module.exports = vehicleRouter;
