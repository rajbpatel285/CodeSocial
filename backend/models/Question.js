const mongoose = require("mongoose");

const testDataSchema = new mongoose.Schema(
  {
    input: String,
    output: String,
  },
  { _id: false }
);

const questionSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
    default: () => new mongoose.Types.ObjectId(),
  },
  questionTitle: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  testCases: [testDataSchema],
  difficulty: {
    type: Number,
    required: true,
  },
  isPublished: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
