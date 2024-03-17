const express = require("express");
const router = express.Router();
const questionController = require("../controllers/questionController");

router.post("/questions", questionController.create);

router.get("/questions", questionController.findAll);

router.get("/questions/:questionId", questionController.findOne);

router.put("/questions/:questionId", questionController.update);

router.delete("/questions/:questionId", questionController.delete);

router.post("/executePython", questionController.executePythonCode);

router.post("/executeJava", questionController.executeJavaCode);

module.exports = router;
