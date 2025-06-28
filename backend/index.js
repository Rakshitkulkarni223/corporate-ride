const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const connectDB = require("./src/database/index");
const userRouter = require("./src/router/user");
const { UPLOADS_FOLDER } = require("./src/helpers/constants");

const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, UPLOADS_FOLDER)));

if (!fs.existsSync(UPLOADS_FOLDER)) {
  fs.mkdirSync(UPLOADS_FOLDER);
}

connectDB();

app.use("/api/user", userRouter);

app.get("/", (req, res)=> {
    res.json({
        message: "server is running..."
    })
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));