const express = require("express");
const router = express.Router();
const questionController = require("../controllers/questionController");

// Create a new Question
router.post("/questions", questionController.create);

// Retrieve all Questions
router.get("/questions", questionController.findAll);

// Retrieve a single Question with questionId
router.get("/questions/:questionId", questionController.findOne);

// Update a Question with questionId
router.put("/questions/:questionId", questionController.update);

// Delete a Question with questionId
router.delete("/questions/:questionId", questionController.delete);

// Inside routes/question.js or wherever you keep your routes
router.post("/executePython", questionController.executePythonCode);

module.exports = router;
