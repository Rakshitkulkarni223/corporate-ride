const User = require("../model/User");
const { saveUserDetails, updateUserDetails, getUserDetails,updateAvatarService, getUserProfileDetails, toggleOfferingStatusService, uploadDocumentsService } = require("../service/user.service");
const handleResponse = require("../utils/handleResponse");

const registerUser = async (req, res) => {
    await handleResponse(req, res, async () => {
        const { body } = req;
        return await saveUserDetails(body);
    });
};

const uploadDocuments = async (req, res) => {
    try {
        await handleResponse(req, res, async () => {
            try {
                const { files } = req;
                const userId = req.params.id;
                const loggedInUserId = req.userId;
                
                if (!files || (!files.officeIdCardUrl && !files.personalIdCardUrl)) {
                    return {
                        status: 400,
                        message: "Required document files are missing"
                    };
                }
                
                return await uploadDocumentsService({ userId, files, loggedInUserId });
            } catch (error) {
                console.error('Error in uploadDocuments controller:', error);
                throw error;
            }
        });
    } catch (error) {
        console.error('Error handling document upload:', error);
        res.status(500).json({
            status: 500,
            message: "Internal server error while uploading documents"
        });
    }
};

const updateAvatar = async (req, res) => {
    await handleResponse(req, res, async () => {
        const { files } = req;
        const userId = req.params.id;
        const loggedInUserId = req.userId;
        
        if (!files || !files.avatar) {
            return {
                status: 400,
                message: "Avatar file is required"
            };
        }
        
        return await updateAvatarService({ userId, files, loggedInUserId });
    });
};

const updateUserProfile = async (req, res) => {
    await handleResponse(req, res, async () => {
        const { body, files } = req;
        const userId = params.id;
        const loggedInUserId = req.userId;
        return await updateUserDetails({ userId, files, body, loggedInUserId });
    });
};

const toggleOfferingStatus = async (req, res) => {
     await handleResponse(req, res, async () => {
        const userId = req.params.id;
        const loggedInUserId = req.userId;
        return await toggleOfferingStatusService({ userId, loggedInUserId });
    });
};

const getUserById = async (req, res) => {
    await handleResponse(req, res, async () => {
        const userId = req.params.id;
        const loggedInUserId = req.userId;
        return await getUserDetails({userId, loggedInUserId});
    });
};


const getUserProfileById = async (req, res) => {
    await handleResponse(req, res, async () => {
        const userId = req.params.id;
        const loggedInUserId = req.userId;
        return await getUserProfileDetails({userId, loggedInUserId});
    });
};

module.exports = {
    registerUser,
    updateUserProfile,
    getUserById,
    getUserProfileById,
    toggleOfferingStatus,
    uploadDocuments,
    updateAvatar
};
