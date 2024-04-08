const mongoose = require("mongoose");

const contestSchema = new mongoose.Schema({
  contestId: {
    type: String,
    required: true,
    unique: true,
  },
  contestName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  questionSet: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },
  ],
  isPublished: {
    type: Boolean,
    default: false,
  },
  isEnded: {
    type: Boolean,
    default: false,
  },
  registeredUsers: [
    {
      type: String,
    },
  ],
});

module.exports = mongoose.model("Contest", contestSchema);
