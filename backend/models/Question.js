const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  questionId: {
    type: String,
    required: true,
    unique: true,
  },
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;