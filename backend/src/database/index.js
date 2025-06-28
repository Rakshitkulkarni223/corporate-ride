require("dotenv").config();
const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");

let bucket;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB connected");

    const db = mongoose.connection.db;
    bucket = new GridFSBucket(db, { bucketName: "uploads" });

  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

function getBucket() {
  if (!bucket) throw new Error("GridFS Bucket not initialized");
  return bucket;
}

module.exports = { connectDB, getBucket };

