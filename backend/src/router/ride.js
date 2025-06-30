const express = require("express");
const authenticateUser = require("../middleware/authMiddleware");
const checkOfferingStatus = require("../middleware/rideOfferMiddleware");
const { createRide, fetchRides, updateRide } = require("../controller/rideOffer.controller");
const { sendRideRequest, getRideRequests } = require("../controller/rideRequest.controller");
const { respondToRideRequest } = require("../controller/rideRespond.controller");

const rideRouter = express.Router();

rideRouter.post("/create", authenticateUser, checkOfferingStatus, createRide);
rideRouter.post("/update/:id", authenticateUser, checkOfferingStatus, updateRide);
rideRouter.get("/",authenticateUser, fetchRides); //  /api/rides?status=active


rideRouter.post("/request", authenticateUser, sendRideRequest);
rideRouter.post("/requests", authenticateUser, getRideRequests);
rideRouter.post("/:id/respond", authenticateUser, checkOfferingStatus, respondToRideRequest);

module.exports = rideRouter;