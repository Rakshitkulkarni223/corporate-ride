const express = require("express");
const { getImageById } = require("../controller/image.controller");

const imageRouter = express.Router();

imageRouter.get("/files/:id", getImageById);

module.exports = imageRouter;