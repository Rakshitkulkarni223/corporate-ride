const express = require("express");
const { vehicleController } = require("../controller");
const authenticateUser = require("../middleware/authMiddleware");
const upload = require("../config/multer");

const vehicleRouter = express.Router();

vehicleRouter.post("/create", authenticateUser, upload.fields([{ name: "image", maxCount: 1 }]), vehicleController.createVehicle);
vehicleRouter.get("/", authenticateUser, vehicleController.getMyVehicle);
vehicleRouter.post("/update/:id", authenticateUser, vehicleController.updateVehicle);

module.exports = vehicleRouter;
