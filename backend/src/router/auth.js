const express = require("express");
const { loginUser, refreshToken } = require("../controller/auth.controller");

const authRouter = express.Router();

authRouter.post("/login", loginUser);
authRouter.post("/refresh", refreshToken);

module.exports = authRouter;