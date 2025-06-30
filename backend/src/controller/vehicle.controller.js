const { vehicleService } = require("../service");
const handleResponse = require("../utils/handleResponse");

const createVehicle = async (req, res) => {
    await handleResponse(req, res, async () => {
        return await vehicleService.createVehicle(req.userId, req.body);
    })
};

const getMyVehicle = async (req, res) => {
    await handleResponse(req, res, async () => {
        return await vehicleService.getMyVehicle(req.userId);
    })
};

const updateVehicle = async (req, res) => {
    await handleResponse(req, res, async () => {
        return await vehicleService.updateVehicle(req.params.id, req.userId, req.body);
    })
};

module.exports = {
    createVehicle,
    updateVehicle,
    getMyVehicle
}