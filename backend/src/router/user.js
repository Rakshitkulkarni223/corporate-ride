const express = require("express");
const { userController } = require('../controller');
const upload = require("../config/multer");
const authenticateUser = require("../middleware/authMiddleware");

const userRouter = express.Router();

userRouter.post("/register",userController.registerUser);

userRouter.put(
  "/update/:id",
  authenticateUser,
  upload.fields([
    { name: "officeIdCardUrl", maxCount: 1 },
    { name: "personalIdCardUrl", maxCount: 1 },
    { name: "avatar", maxCount: 1 },
  ]),
  userController.updateUserProfile
);

userRouter.get("/:id",authenticateUser,userController.getUserById);
userRouter.get("/profile/:id",authenticateUser,userController.getUserProfileById);

module.exports = userRouter;