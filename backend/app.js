const express = require("express");
const cors = require("cors");
const mongoose = require("./mongo"); // Ensure the MongoDB connection
const authRoutes = require("./routes/authRoutes");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Use routes
app.use("/auth", authRoutes);

app.listen(8000, () => {
  console.log("Server running on port 8000");
});
