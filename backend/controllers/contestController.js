const Contest = require("../models/Contest");
const Question = require("../models/Question");
const User = require("../models/User");
const mongoose = require("mongoose");

exports.create = async (req, res) => {
  const { contestName, description, level, startTime, endTime } = req.body;

  const contest = new Contest({
    contestId: new mongoose.Types.ObjectId(),
    contestName,
    description,
    level,
    startTime,
    endTime,
    questionSet: [],
    isPublished: false,
    isEnded: false,
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
    const contest = await Contest.findOne({ contestId: contestId });
    if (!contest) {
      return res.status(404).send({
        message: `Cannot find Contest with id=${contestId}.`,
      });
    }

    await Promise.all(
      contest.questionSet.map((questionId) =>
        Question.deleteOne({ questionId: questionId })
      )
    );

    const deletedContest = await Contest.findOneAndDelete({
      contestId: contestId,
    });

    res.send({
      message: "Contest and its questions were deleted successfully!",
      deletedContest,
    });
  } catch (error) {
    console.error("Error deleting contest and its questions:", error);
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

exports.setContestLive = async (req, res) => {
  const { contestId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(contestId)) {
    return res.status(400).send({ message: "Invalid contest ID format." });
  }

  try {
    const updatedContest = await Contest.findOneAndUpdate(
      { contestId: contestId },
      { $set: { isLive: true } },
      { new: true }
    );

    if (!updatedContest) {
      return res.status(404).send({
        message: `Cannot find contest with id=${contestId}. Maybe contest was not found!`,
      });
    }

    res.send({
      message: "Contest has been set to live successfully.",
      contest: updatedContest,
    });
  } catch (error) {
    res.status(500).send({
      message: `Error ending contest with id=${contestId}.`,
    });
  }
};

exports.endContest = async (req, res) => {
  try {
    const { contestId } = req.params;
    const contest = await Contest.findOneAndUpdate(
      { contestId: contestId },
      { $set: { isEnded: true } },
      { new: true }
    );

    if (!contest) {
      return res.status(404).send({ message: "Contest not found" });
    }

    await Promise.all(
      contest.questionSet.map(async (questionIdValue) => {
        await Question.findOneAndUpdate(
          { questionId: questionIdValue },
          { $set: { isPublished: true } },
          { new: true }
        );
      })
    );

    const scoreResults = await exports.calculateAndUpdateContestScores(
      contestId
    );

    if (scoreResults.error) {
      return res.status(500).send(scoreResults);
    }

    res.send({
      message: "Contest ended and scores calculated successfully!",
      contest: contest,
    });
  } catch (error) {
    console.error("Error ending contest and calculating scores:", error);
    res
      .status(500)
      .send({ message: "Error ending contest and calculating scores" });
  }
};

exports.calculateAndUpdateContestScores = async (contestId) => {
  try {
    const contest = await Contest.findOne({ contestId: contestId });

    if (!contest) {
      return { error: "Contest not found" };
    }

    const users = await User.find(
      {
        $or: [
          { email: { $in: contest.registeredUsers } },
          { username: { $in: contest.registeredUsers } },
        ],
      },
      "userId email username questionsSolved rating maxRating"
    );

    let userScores = users.map((user) => {
      console.log("YESSSSSSS + ", user);
      const numSolved = user.questionsSolved.filter((q) =>
        contest.questionSet.includes(q)
      ).length;
      return {
        email: user.email,
        username: user.username,
        numSolved: numSolved,
        rating: user.rating,
        maxRating: user.maxRating,
      };
    });

    userScores.sort((a, b) => b.numSolved - a.numSolved);

    const totalParticipants = userScores.length;
    const top20PercentIndex = Math.ceil(totalParticipants * 0.2) - 1;
    const bottom20PercentIndex = Math.floor(totalParticipants * 0.8);

    userScores.forEach(async (userScore, index) => {
      let newRating;
      if (index <= top20PercentIndex) {
        newRating = userScore.rating + 50;
      } else if (index >= bottom20PercentIndex) {
        newRating = userScore.rating - 20;
      } else {
        newRating = userScore.rating + 25;
      }

      const maxRating = Math.max(userScore.maxRating, newRating);

      await User.findOneAndUpdate(
        { username: userScore.username },
        {
          $set: { rating: newRating, maxRating: maxRating },
        }
      );
    });

    return userScores;
  } catch (error) {
    console.error("Failed to calculate scores: ", error);
    return { error: "Failed to calculate scores due to an internal error." };
  }
};
