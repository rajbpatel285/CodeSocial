const mongoose = require("mongoose");

const MONGODB_URI =
  "mongodb+srv://rajpatel_28:rajpatel%40123@codesocial.jnblfii.mongodb.net/?retryWrites=true&w=majority&appName=CodeSocial/codesocial-db";

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });

module.exports = mongoose;
