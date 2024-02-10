const Question = require("../models/Question");
const mongoose = require("mongoose");

// Create and Save a new Question
exports.create = async (req, res) => {
  if (!req.body.question || !req.body.answer) {
    return res.status(400).send({
      message: "Question content can not be empty",
    });
  }

  // Create a Question
  const question = new Question({
    questionId: new mongoose.Types.ObjectId(),
    questionTitle: req.body.questionTitle,
    question: req.body.question,
    answer: req.body.answer,
    difficulty: req.body.difficulty,
  });

  // Save Question in the database
  try {
    const data = await question.save();
    res.send(data);
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Some error occurred while creating the Question.",
    });
  }
};

// Retrieve and return all questions from the database.
exports.findAll = async (req, res) => {
  try {
    const questions = await Question.find();
    res.send(questions);
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Some error occurred while retrieving questions.",
    });
  }
};

// Find a single question with a questionId
exports.findOne = async (req, res) => {
  try {
    const question = await Question.findOne({
      questionId: req.params.questionId,
    });
    if (!question) {
      return res.status(404).send({
        message: "Question not found with id " + req.params.questionId,
      });
    }
    res.send(question);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).send({
        message: "Question not found with id " + req.params.questionId,
      });
    }
    return res.status(500).send({
      message: "Error retrieving question with id " + req.params.questionId,
    });
  }
};

// Update a question identified by the questionId in the request
exports.update = async (req, res) => {
  // Validate Request
  if (!req.body.question || !req.body.answer) {
    return res.status(400).send({
      message: "Question content can not be empty",
    });
  }

  // Find question and update it with the request body
  try {
    const question = await Question.findOneAndUpdate(
      { questionId: req.params.questionId },
      {
        questionTitle: req.body.questionTitle,
        question: req.body.question,
        answer: req.body.answer,
        difficulty: req.body.difficulty,
      },
      { new: true }
    );

    if (!question) {
      return res.status(404).send({
        message: "Question not found with id " + req.params.questionId,
      });
    }
    res.send(question);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).send({
        message: "Question not found with id " + req.params.questionId,
      });
    }
    return res.status(500).send({
      message: "Error updating question with id " + req.params.questionId,
    });
  }
};

// Delete a question with the specified questionId in the request
exports.delete = async (req, res) => {
  try {
    const question = await Question.findOneAndRemove({
      questionId: req.params.questionId,
    });
    if (!question) {
      return res.status(404).send({
        message: "Question not found with id " + req.params.questionId,
      });
    }
    res.send({ message: "Question deleted successfully!" });
  } catch (error) {
    if (error.kind === "ObjectId" || error.name === "NotFound") {
      return res.status(404).send({
        message: "Question not found with id " + req.params.questionId,
      });
    }
    return res.status(500).send({
      message: "Could not delete question with id " + req.params.questionId,
    });
  }
};
