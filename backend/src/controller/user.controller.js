const { getBucket } = require("../database");
const { saveUserDetails } = require("../service/user.service");
const handleResponse = require("../utils/handleResponse");
const { postImageUpload } = require("../utils/handleImageUpload");

const registerUser = async (req, res) => {
    await handleResponse(req, res, async () => {
        const bucket = getBucket();
        const { body, files } = req;
        const mobileNumber = body.mobileNumber || "temp";
        const fields = ["avatar", "officeIdCardUrl", "personalIdCardUrl"];
        const { uploadedFiles, uploadedFileIds } = await postImageUpload(files, fields, mobileNumber);

        try {
            return await saveUserDetails({
                ...body,
                avatar: uploadedFiles.avatar,
                officeIdCardUrl: uploadedFiles.officeIdCardUrl,
                personalIdCardUrl: uploadedFiles.personalIdCardUrl,
            });
        } catch (err) {
            console.error("User save failed. Cleaning up uploaded files...", err);
            for (const fileId of uploadedFileIds) {
                try {
                    await bucket.delete(fileId);
                } catch (delErr) {
                    console.error(`Failed to delete file with id ${fileId}`, delErr);
                }
            }
            throw err;
        }
    });
};

module.exports = {
    registerUser,
};
