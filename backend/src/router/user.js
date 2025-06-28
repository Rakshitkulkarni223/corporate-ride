const express = require("express");
const { userController } = require('../controller');
const { upload } = require("../utils/handleImageUpload");

const userRouter = express.Router();

userRouter.post( "/save",
  upload.fields([
    { name: "officeIdCardUrl", maxCount: 1 },
    { name: "personalIdCardUrl", maxCount: 1 },
    { name: "avatar", maxCount: 1 },
  ]),
  userController.registerUser
);

module.exports = userRouter;