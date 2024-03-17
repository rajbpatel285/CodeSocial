const Question = require("../models/Question");
const Contest = require("../models/Contest");
const mongoose = require("mongoose");
const axios = require("axios");

exports.create = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Content cannot be empty",
    });
  }

  const {
    questionTitle,
    question,
    inputVariableTypeData,
    testCases,
    difficulty,
    isPublished,
  } = req.body;

  const newQuestion = new Question({
    questionTitle,
    question,
    inputVariableTypeData,
    testCases,
    difficulty,
    isPublished,
  });

  try {
    const data = await newQuestion.save();
    res.send(data);
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "An error occurred while creating the question.",
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
      message: "Content cannot be empty",
    });
  }

  const { questionId } = req.params;
  const {
    questionTitle,
    question,
    inputVariableTypeData,
    testCases,
    difficulty,
    isPublished,
  } = req.body;

  const updateObject = {
    questionTitle,
    question,
    inputVariableTypeData,
    testCases,
    difficulty,
    isPublished,
  };

  try {
    const updatedQuestion = await Question.findOneAndUpdate(
      { questionId: questionId },
      updateObject,
      { new: true }
    );

    if (!updatedQuestion) {
      return res.status(404).send({
        message: `Question not found with id ${questionId}`,
      });
    }

    res.send(updatedQuestion);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).send({
        message: `Question not found with id ${questionId}`,
      });
    }
    res.status(500).send({
      message: error.message || `Error updating question with id ${questionId}`,
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
      questionDeleted,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Could not delete question" });
  }
};

exports.executePythonCode = async (req, res) => {
  const { code, inputs } = req.body;

  const clientId = "b7685c40695e4cf1f500f45143fb8751";
  const clientSecret =
    "9839cffc6250bd8fd91056a16bd16c5b718ee20a52cf8202a606fe0e01e307a0";

  const stdin = inputs.join("\n");

  try {
    const response = await axios({
      method: "post",
      url: "https://api.jdoodle.com/v1/execute",
      data: {
        script: code,
        stdin: stdin,
        language: "python3",
        versionIndex: "3",
        clientId: clientId,
        clientSecret: clientSecret,
      },
    });

    res.json({
      output: response.data.output,
      statusCode: response.data.statusCode,
      memory: response.data.memory,
      cpuTime: response.data.cpuTime,
    });
  } catch (error) {
    console.error("Error executing Python code:", error);
    res.status(500).send({ message: "Failed to execute Python code." });
  }
};

exports.executeJavaCode = async (req, res) => {
  const { code, inputs } = req.body;

  const clientId = "b7685c40695e4cf1f500f45143fb8751";
  const clientSecret =
    "9839cffc6250bd8fd91056a16bd16c5b718ee20a52cf8202a606fe0e01e307a0";

  const stdin = inputs.join("\n");

  try {
    const response = await axios({
      method: "post",
      url: "https://api.jdoodle.com/v1/execute",
      data: {
        script: code,
        stdin: stdin,
        language: "java",
        versionIndex: "3",
        clientId: clientId,
        clientSecret: clientSecret,
      },
    });

    res.json({
      output: response.data.output,
      statusCode: response.data.statusCode,
      memory: response.data.memory,
      cpuTime: response.data.cpuTime,
    });
  } catch (error) {
    console.error("Error executing Java code:", error);
    res.status(500).send({ message: "Failed to execute Java code." });
  }
};
