const { REFRESH_TOKEN_EXPIRES, ACCESS_TOKEN_EXPIRES } = require("../helpers/constants");
const User = require("../model/User");
const { loginUserService } = require("../service/auth.service");
const handleResponse = require("../utils/handleResponse");
const { generateJWT } = require("../utils/token");

const loginUser = async (req, res) => {
    await handleResponse(req, res, async () => {
        const { mobileNumber, password } = req.body;
        const response = await loginUserService({ mobileNumber, password });
        res.cookie("token", response.refreshTokenObj.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            expires: response.refreshTokenObj.expires
        });
        return response;
    });
};

const refreshToken = async (req, res) => {
    await handleResponse(req, res, async () => {

        let token = req.cookies.refreshToken;
        if (!token) throw { status: 401, message: "Refresh token missing" };

        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(decoded.id);
        if (!user || user.refreshToken !== token) {
            throw { status: 401, message: "Invalid refresh token" };
        }

        const tokenObj = await generateJWT( user,  process.env.ACCESS_TOKEN_SECRET, "ACCESS")

        return {
            status: 200,
            message: "Token refreshed",
            data: {
                token: tokenObj.token,
                expires: tokenObj.expires
            }
        }
    })
};


const logout =  async (req, res) => {
    await handleResponse(req, res, async () => {
        res.clearCookie("token");
        return {
            status: 200,
            message: "Logged out successfully",
            data: []
        }
    })
};

module.exports = { loginUser, refreshToken, logout };