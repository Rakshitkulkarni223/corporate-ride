const express = require("express");
const cors = require("cors");
const { connectDB } = require("./src/database/index");
const userRouter = require("./src/router/user");
const authRouter = require("./src/router/auth");

const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/user", userRouter);
app.use("/api", authRouter);

app.get("/", (req, res) => {
  res.json({
    message: "server is running..."
  })
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));