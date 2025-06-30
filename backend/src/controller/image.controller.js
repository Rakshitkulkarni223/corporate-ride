const mongoose = require("mongoose");
const { getBucket } = require("../database");

const getImageById = async (req, res) => {
    try {
        const fileId = new mongoose.Types.ObjectId(req.params.id);
        const bucket =  getBucket();

        const downloadStream = bucket.openDownloadStream(fileId);

        downloadStream.on("error", () => {
            res.status(404).json({ message: "File not found" });
        });

        res.set("Content-Type", "image/jpeg");
        downloadStream.pipe(res);
    } catch (err) {
        res.status(400).json({ message: "Invalid file ID" });
    }
};

module.exports = { getImageById };