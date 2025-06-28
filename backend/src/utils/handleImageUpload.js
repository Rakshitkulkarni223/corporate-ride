const multer = require("multer");
const path = require("path");
const { UPLOADS_FOLDER } = require("../helpers/constants");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_FOLDER),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Invalid file type. Only JPG, PNG, and PDF are allowed."));
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
});

module.exports = {
    upload
} 