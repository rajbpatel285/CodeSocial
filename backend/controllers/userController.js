const User = require("../models/User");

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

exports.getStarredQuestions = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findOne({
      $or: [{ email: userId }, { username: userId }],
    });
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

exports.getUsers = async (req, res) => {
  try {
    // Fetch only non-admin users
    const users = await User.find(
      { isAdmin: false },
      "username rating -_id"
    ).sort({ rating: -1 });
    res.json(users);
  } catch (error) {
    console.error("Failed to fetch users", error);
    res.status(500).send("Server error");
  }
};
