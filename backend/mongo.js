const mongoose = require("mongoose");

const MONGODB_URI = "mongodb://0.0.0.0:27017/react-login-tut";

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });

module.exports = mongoose;
