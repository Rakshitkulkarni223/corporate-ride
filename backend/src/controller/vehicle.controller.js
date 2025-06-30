const { vehicleService } = require("../service");
const handleResponse = require("../utils/handleResponse");

const createVehicle = async (req, res) => {
    await handleResponse(req, res, async () => {
        const {body, files } = req
        return await vehicleService.createVehicle({userId: req.userId, body, files});
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