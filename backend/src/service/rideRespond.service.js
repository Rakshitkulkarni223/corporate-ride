const { RIDE_REQUEST_STATUS } = require("../helpers/constants");
const RideOffer = require("../model/RideOffer");
const RideRequest = require("../model/RideRequest");
const checkUserAccess = require("../utils/checkAccess");

const handleRideRequest = async ({ requestId, status, userId, loggedInUserId }) => {
    checkUserAccess(userId, loggedInUserId)

    if (![RIDE_REQUEST_STATUS.ACCEPTED, RIDE_REQUEST_STATUS.REJECTED].includes(status)) {
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

    if (request.status !== RIDE_REQUEST_STATUS.SENT) {
        throw {
            status: 400,
            message: "Request already responded."
        };
    }

    request.status = status;
    request.respondedAt = new Date();

    if (status === RIDE_REQUEST_STATUS.ACCEPTED) {
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
        data: {...request.toObject()}
    }
};


module.exports = {
    handleRideRequest
}
