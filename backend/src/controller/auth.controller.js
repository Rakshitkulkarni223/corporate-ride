const User = require("../model/User");
const { loginUserService } = require("../service/auth.service");
const handleResponse = require("../utils/handleResponse");

const loginUser = async (req, res) => {
    await handleResponse(req, res, async () => {
        const { mobileNumber, password } = req.body;
        const response = await loginUserService({ mobileNumber, password });
        res.cookie("token", response.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return response;
    });
};

const refreshToken = async (req, res) => {
    await handleResponse(req, res, async () => {
        const token = req.cookies.refreshToken;
        if (!token) throw { status: 401, message: "Refresh token missing" };
        const decoded = jwt.verify(token, process.env.REFRESH_SECRET);
        const user = await User.findById(decoded.id);
        if (!user || user.refreshToken !== token) {
            throw { status: 401, message: "Invalid refresh token" };
        }

        const newAccessToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return {
            status: 200,
            message: "Token refreshed",
            data: {
                token: newAccessToken
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