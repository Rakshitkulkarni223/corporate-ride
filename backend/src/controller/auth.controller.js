const { loginUserService } = require("../service/auth.service");
const handleResponse = require("../utils/handleResponse");

const loginUser = async (req, res) => {
  await handleResponse(req, res, async () => {
    const { mobileNumber, password } = req.body;
    return await loginUserService({ mobileNumber, password });
  });
};

module.exports = { loginUser };