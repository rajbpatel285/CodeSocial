const Contest = require("../models/Contest");
const Question = require("../models/Question");
const mongoose = require("mongoose");

exports.create = async (req, res) => {
  const { contestName, description, level, date } = req.body;

  const adjustedDate = new Date(date);
  adjustedDate.setDate(adjustedDate.getDate() + 1);

  const contest = new Contest({
    contestId: new mongoose.Types.ObjectId(),
    contestName,
    description,
    level,
    date: adjustedDate,
    questionSet: [],
    isPublished: false,
    registeredUsers: [],
  });

  try {
    const data = await contest.save();
    res.send(data);
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Some error occurred while creating the Contest.",
    });
  }
};

exports.findAll = async (req, res) => {
  try {
    const contests = await Contest.find();
    res.send(contests);
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Some error occurred while retrieving contests.",
    });
  }
};

exports.findOne = async (req, res) => {
  const { contestId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(contestId)) {
    return res.status(400).send({ message: "Invalid contest ID format." });
  }

  try {
    const contest = await Contest.findOne({
      contestId: req.params.contestId,
    });
    if (!contest) {
      return res
        .status(404)
        .send({ message: "Contest not found with id " + contestId });
    }
    res.send(contest);
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Error retrieving contest with id " + contestId });
  }
};

exports.update = async (req, res) => {
  const { contestId } = req.params;

  if (!req.body) {
    return res.status(400).send({ message: "Data to update cannot be empty!" });
  }

  try {
    const contest = await Contest.findOneAndUpdate(
      { contestId: contestId },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!contest) {
      return res.status(404).send({
        message: `Cannot update Contest with id=${contestId}. Maybe Contest was not found!`,
      });
    }

    res.send({ message: "Contest was updated successfully.", contest });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error updating Contest with id=" + contestId });
  }
};

exports.delete = async (req, res) => {
  const { contestId } = req.params;

  try {
    const contest = await Contest.findOneAndDelete({ contestId: contestId });
    if (!contest) {
      return res.status(404).send({
        message: `Cannot delete Contest with id=${contestId}. Maybe Contest was not found!`,
      });
    }
    res.send({ message: "Contest was deleted successfully!", contest });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Could not delete Contest with id=" + contestId });
  }
};

exports.addQuestionToContest = async (req, res) => {
  const { questionId } = req.body;

  try {
    const contest = await Contest.findOne({
      contestId: req.params.contestId,
    });
    if (!contest) {
      return res.status(404).send({ message: "Contest not found" });
    }

    contest.questionSet.push(questionId);

    await contest.save();

    res
      .status(200)
      .send({ message: "Question added to contest successfully", contest });
  } catch (error) {
    console.error("Error adding question to contest:", error);
    res.status(500).send({ message: "Server error" });
  }
};

exports.togglePublishContest = async (req, res) => {
  const { contestId } = req.params;

  try {
    const contest = await Contest.findOne({ contestId: contestId });

    if (!contest) {
      return res.status(404).send({
        message: `Contest not found with id=${contestId}.`,
      });
    }

    const isPublishedToggle = !contest.isPublished;

    const updatedContest = await Contest.findOneAndUpdate(
      { contestId: contestId },
      { $set: { isPublished: isPublishedToggle } },
      { new: true }
    );

    await Promise.all(
      contest.questionSet.map(async (questionIdValue) => {
        await Question.findOneAndUpdate(
          { questionId: questionIdValue },
          { $set: { isPublished: isPublishedToggle } },
          { new: true }
        );
      })
    );

    const action = isPublishedToggle ? "published" : "withdrawn";
    res.send({
      message: `Contest ${action} successfully.`,
      contest: updatedContest,
    });
  } catch (error) {
    console.error("Error toggling contest publish state:", error);
    res.status(500).send({
      message: `Error toggling publish state for contest with id=${contestId}.`,
    });
  }
};

exports.registerForContest = async (req, res) => {
  const { userId } = req.body;
  const { contestId } = req.params;

  try {
    const updatedContest = await Contest.findOneAndUpdate(
      { contestId: contestId },
      { $addToSet: { registeredUsers: userId } },
      { new: true }
    );
    res.json(updatedContest);
  } catch (error) {
    res.status(500).send({ message: "Error registering for contest." });
  }
};

exports.unregisterFromContest = async (req, res) => {
  const { userId } = req.body;
  const { contestId } = req.params;

  try {
    const updatedContest = await Contest.findOneAndUpdate(
      { contestId: contestId },
      { $pull: { registeredUsers: userId } },
      { new: true }
    );
    res.json(updatedContest);
  } catch (error) {
    res.status(500).send({ message: "Error unregistering from contest." });
  }
};
