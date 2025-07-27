const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const { connectDB } = require("./src/database/index");
const userRouter = require("./src/router/user");
const authRouter = require("./src/router/auth");
const rideRouter = require("./src/router/ride");
const vehicleRouter = require("./src/router/vehicle");
const imageRouter = require("./src/router/image");
const { scheduleRideStatusUpdates } = require('./src/scheduler/rideStatusUpdater');

const app = express();
require("dotenv").config();

app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

connectDB();

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/ride", rideRouter);
app.use("/api/vehicle", vehicleRouter);
app.use("/api/image", imageRouter);

app.get("/", (req, res) => {
  res.json({
    message: "server is running..."
  })
});

const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  try {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    
    // Initialize the ride status update scheduler
    console.log('Initializing background schedulers...');
    scheduleRideStatusUpdates();
  } catch (error) {
    console.error('Error during server startup:', error);
  }
});