require("dotenv").config();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const express = require("express");
const authRoute= require("./routes/auth")
const storyRoute = require ("./routes/story")
const app = express();

app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("DB Connected!"))
  .catch((error) => console.log("DB failed to connect", error));

// app.get("/api/health", (req, res) => {
//   console.log("hey");
//   res.json({
//     service: "Backend swiptory",
//     time: new Date(),
//   });
// });
app.use(cookieParser());
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/story", storyRoute);

const port = 3000;

app.listen(port, () => {
  console.log(`Backend Server running at port ${port}`);
});

