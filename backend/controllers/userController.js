const User = require("../models/User");

// Add a starred question
exports.addStarredQuestion = async (req, res) => {
  const { userId, questionId } = req.body;
  try {
    await User.findOneAndUpdate(
      { $or: [{ email: userId }, { username: userId }] },
      { $addToSet: { starredQuestions: questionId } },
      { new: true }
    );
    res.status(200).send({ message: "Question starred successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error starring question", error });
  }
};

// Remove a starred question
exports.removeStarredQuestion = async (req, res) => {
  const { userId, questionId } = req.body;
  try {
    await User.findOneAndUpdate(
      { $or: [{ email: userId }, { username: userId }] },
      { $pull: { starredQuestions: questionId } },
      { new: true }
    );
    res.status(200).send({ message: "Question unstarred successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error unstarring question", error });
  }
};

// Get starred questions for a user
exports.getStarredQuestions = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findOne({
      $or: [{ email: userId }, { username: userId }],
    });
    console.log(user);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send(user.starredQuestions);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error fetching starred questions", error });
  }
};
