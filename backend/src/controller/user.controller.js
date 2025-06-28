const { saveUserDetails, updateUserDetails } = require("../service/user.service");
const handleResponse = require("../utils/handleResponse");

const registerUser = async (req, res) => {
    await handleResponse(req, res, async () => {
        const { body } = req;
        return await saveUserDetails(body);
    });
};


const updateUserProfile = async (req, res) => {
    await handleResponse(req, res, async () => {
        const { body, files } = req;
        const userId = params.id;

        if (!userId) {
            throw {
                status: 400,
                message: "User ID is missing.",
            };
        }

        return await updateUserDetails({ userId, files, body });
    });
};

module.exports = {
    registerUser,
    updateUserProfile
};
