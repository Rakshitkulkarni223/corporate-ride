const { handleRideRequest } = require("../service/rideRespond.service");
const handleResponse = require("../utils/handleResponse");

const respondToRideRequest = async (req, res) => {
    await handleResponse(req, res, async () => {
        const { id: requestId } = req.params;
        const { userId, status } = req.body;
        const loggedInUserId = req.userId;
        return await handleRideRequest({ requestId, status, userId, loggedInUserId })
    })
};

module.exports = {
    respondToRideRequest
}
