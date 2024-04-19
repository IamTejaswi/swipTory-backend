require("dotenv").config();
const mongoose = require("mongoose");

const express = require("express");
const authRoute= require("./routes/auth")

const app = express();

app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("DB Connected!"))
  .catch((error) => console.log("DB failed to connect", error));

app.get("/api/health", (req, res) => {
  console.log("hey");
  res.json({
    service: "Backend swiptory",
    time: new Date(),
  });
});

app.use("/api/v1/auth", authRoute);

const port = 3000;

app.listen(port, () => {
  console.log(`Backend Server running at port ${port}`);
});

