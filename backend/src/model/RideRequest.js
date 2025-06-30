const mongoose = require("mongoose");

const RideRequestSchema = new mongoose.Schema({
    rideOffer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RideOffer",
        required: true,
    },
    passenger: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: ["sent", "accepted", "rejected"],
        default: "sent",
    },
    message: {
        type: String,
        trim: true,
    },
    requestedAt: {
        type: Date,
        default: Date.now,
    },
    respondedAt: {
        type: Date,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("RideRequest", RideRequestSchema);