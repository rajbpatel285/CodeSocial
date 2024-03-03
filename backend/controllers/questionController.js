const Question = require("../models/Question");
const Contest = require("../models/Contest");
const mongoose = require("mongoose");

exports.create = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Question content can not be empty",
    });
  }

  const question = new Question({
    questionId: new mongoose.Types.ObjectId(),
    questionTitle: req.body.questionTitle,
    question: req.body.question,
    input: req.body.input,
    output: req.body.output,
    difficulty: req.body.difficulty,
  });

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

exports.update = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Question content can not be empty",
    });
  }

  try {
    const question = await Question.findOneAndUpdate(
      { questionId: req.params.questionId },
      {
        questionTitle: req.body.questionTitle,
        question: req.body.question,
        input: req.body.input,
        output: req.body.output,
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

exports.removeQuestionFromContest = async (questionId) => {
  try {
    await Contest.updateMany(
      { questionSet: questionId },
      { $pull: { questionSet: questionId } }
    );

    return { message: "Question removed from contest(s) successfully" };
  } catch (error) {
    console.error("Error removing question from contest:", error);
    throw error;
  }
};

exports.delete = async (req, res) => {
  const { questionId } = req.params;

  try {
    const removalResult = await exports.removeQuestionFromContest(questionId);

    const questionDeleted = await Question.findOneAndDelete({
      questionId: req.params.questionId,
    });
    if (!questionDeleted) {
      return res.status(404).send({ message: "Question not found" });
    }

    res.send({
      message: "Question removed from contest(s) and deleted successfully",
      removalResult,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Could not delete question" });
  }
};
