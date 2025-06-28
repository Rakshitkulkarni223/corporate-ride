const { saveUserDetails } = require("../service/user.service");
const handleResponse = require("../utils/handleResponse");

const registerUser = async (req, res) => {
  await handleResponse(req, res, async () => {
    const { body, files } = req;
    const avatar = files["avatar"]?.[0]?.path || "";
    const officeIdCardUrl = files["officeIdCardUrl"]?.[0]?.path || "";
    const personalIdCardUrl = files["personalIdCardUrl"]?.[0]?.path || "";

    return await saveUserDetails({
      ...body,
      avatar,
      officeIdCardUrl,
      personalIdCardUrl,
    });
  });
};

module.exports = {
  registerUser,
};
