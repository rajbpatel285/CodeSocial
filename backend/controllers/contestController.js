const Contest = require("../models/Contest");
const mongoose = require("mongoose");

exports.create = async (req, res) => {
  const { contestName, description, level, date } = req.body;

  const contest = new Contest({
    contestId: new mongoose.Types.ObjectId(),
    contestName,
    description,
    level,
    date,
    questionSet: [],
    isPublished: false,
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

  try {
    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res
        .status(404)
        .send({ message: "Contest not found with id " + contestId });
    }
    res.send(contest);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res
        .status(404)
        .send({ message: "Contest not found with id " + contestId });
    }
    return res
      .status(500)
      .send({ message: "Error retrieving contest with id " + contestId });
  }
};

exports.update = async (req, res) => {
  const { contestId } = req.params;

  if (!req.body) {
    return res
      .status(400)
      .send({ message: "Data to update can not be empty!" });
  }

  try {
    const contest = await Contest.findByIdAndUpdate(contestId, req.body, {
      new: true,
    });
    if (!contest) {
      return res.status(404).send({
        message: `Cannot update Contest with id=${contestId}. Maybe Contest was not found!`,
      });
    }
    res.send({ message: "Contest was updated successfully." });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error updating Contest with id=" + contestId });
  }
};

exports.delete = async (req, res) => {
  const { contestId } = req.params;

  try {
    const contest = await Contest.findByIdAndRemove(contestId);
    if (!contest) {
      return res.status(404).send({
        message: `Cannot delete Contest with id=${contestId}. Maybe Contest was not found!`,
      });
    }
    res.send({ message: "Contest was deleted successfully!" });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Could not delete Contest with id=" + contestId });
  }
};
