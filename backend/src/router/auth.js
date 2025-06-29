const express = require("express");
const { authController } = require("../controller");

const authRouter = express.Router();

authRouter.post("/login", authController.loginUser);
authRouter.post("/refresh", authController.refreshToken);

module.exports = authRouter;