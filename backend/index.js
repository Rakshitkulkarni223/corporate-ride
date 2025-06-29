const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const { connectDB } = require("./src/database/index");
const userRouter = require("./src/router/user");
const authRouter = require("./src/router/auth");

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

app.get("/", (req, res) => {
  res.json({
    message: "server is running..."
  })
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));