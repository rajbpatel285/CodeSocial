const express = require("express");
const cors = require("cors");
const mongoose = require("./mongo");
const authRoutes = require("./routes/authRoutes");
const questionRoutes = require("./routes/questionRoutes");
const contestRoutes = require("./routes/contestRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/auth", authRoutes);
app.use("/question", questionRoutes);
app.use("/contest", contestRoutes);
app.use("/user", userRoutes);

app.listen(8000, () => {
  console.log("Server running on port 8000");
});
