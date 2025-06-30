const RideOffer = require("../model/RideOffer");
const RideRequest = require("../model/RideRequest");
const checkUserAccess = require("../utils/checkAccess");

const handleRideRequest = async ({ requestId, status, userId, loggedInUserId }) => {
    checkUserAccess(userId, loggedInUserId)

    if (!["accepted", "rejected"].includes(status)) {
        throw {
            status: 400,
            message: "Invalid status."
        };
    }

    const request = await RideRequest.findById(requestId).populate("rideOffer");

    if (!request) {
        throw {
            status: 404,
            message: "Request not found."
        };
    }

    if (String(request.rideOffer.owner) !== String(userId)) {
        throw {
            status: 403,
            message: "Not authorized."
        };
    }

    if (request.status !== "sent") {
        throw {
            status: 400,
            message: "Request already responded to."
        };
    }

    request.status = status;
    request.respondedAt = new Date();

    if (status === "accepted") {
        const ride = await RideOffer.findById(request.rideOffer._id);

        if (ride.availableSeats <= 0) {
            throw {
                status: 400,
                message: "No seats available."
            };
        }

        ride.availableSeats -= 1;
        await ride.save();
    }

    await request.save();

    return {
        status: 200,
        message: Request `${status}`,
        data: {...request}
    }
};


module.exports = {
    handleRideRequest
}
