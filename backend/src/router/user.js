const express = require("express");

const upload = require("../config/multer");
const authenticateUser = require("../middleware/authMiddleware");
const { registerUser, updateUserProfile, getUserById, getUserProfileById, toggleOfferingStatus } = require("../controller/user.controller");

const userRouter = express.Router();

userRouter.post("/register", registerUser);

userRouter.put(
  "/update/:id",
  authenticateUser,
  upload.fields([
    { name: "officeIdCardUrl", maxCount: 1 },
    { name: "personalIdCardUrl", maxCount: 1 },
    { name: "avatar", maxCount: 1 },
  ]),
  updateUserProfile
);

userRouter.put("/toggle-offering/:id", authenticateUser, toggleOfferingStatus);
userRouter.get("/:id", authenticateUser, getUserById);
userRouter.get("/profile/:id", authenticateUser, getUserProfileById);

module.exports = userRouter;