const express = require("express");
const contestController = require("../controllers/contestController");

const router = express.Router();

router.post("/", contestController.create);

router.get("/", contestController.findAll);

router.get("/:contestId", contestController.findOne);

router.put("/:contestId", contestController.update);

router.delete("/:contestId", contestController.delete);

router.put("/addQuestion/:contestId", contestController.addQuestionToContest);

module.exports = router;
