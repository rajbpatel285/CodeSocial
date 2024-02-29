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
    const users = await User.find({ isAdmin: false }).sort({ rating: -1 });
    res.json(users);
  } catch (error) {
    console.error("Failed to fetch users", error);
    res.status(500).send("Server error");
  }
};

exports.getUserDetails = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findOne({
      $or: [{ email: userId }, { username: userId }],
    }).populate("starredQuestions");

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).send({ message: "Error fetching user details", error });
  }
};

exports.updateUserProfile = async (req, res) => {
  const { userId } = req.params;
  const { username, name, email } = req.body;

  try {
    const existingUsername = await User.findOne({ username });

    if (existingUsername && existingUsername.email !== email) {
      return res.json("username already exists");
    }

    const user = await User.findOneAndUpdate(
      { $or: [{ email: userId }, { username: userId }] },
      { $set: { username, name } },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        email: user.email,
        username: user.username,
        name: user.name,
        rating: user.rating,
        starredQuestions: user.starredQuestions,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).send({ message: "Username already exists" });
    }
    res.status(500).send({ message: "Error updating user profile", error });
  }
};

exports.addFriend = async (req, res) => {
  const { userId, friendId } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { $or: [{ email: userId }, { username: userId }] },
      { $addToSet: { friends: friendId } },
      { new: true, runValidators: true }
    );
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send({ message: "Friend added successfully", user });
  } catch (error) {
    res.status(500).send({ message: "Error adding friend", error });
  }
};

exports.removeFriend = async (req, res) => {
  const { userId, friendId } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { $or: [{ email: userId }, { username: userId }] },
      { $pull: { friends: friendId } },
      { new: true }
    );
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send({ message: "Friend removed successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error removing friend", error });
  }
};

exports.checkFriendship = async (req, res) => {
  const { userId, profileId } = req.query;

  try {
    const user = await User.findOne({
      $or: [{ email: userId }, { username: userId }],
    });
    const isFriend = user.friends.some(
      (friendId) => friendId.toString() === profileId
    );

    res.status(200).json({ isFriend });
  } catch (error) {
    console.error("Failed to check friendship status", error);
    res
      .status(500)
      .send({ message: "Error checking friendship status", error });
  }
};

exports.fetchFriends = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findOne({
      $or: [{ email: userId }, { username: userId }],
    }).populate("friends", "username email rating name");

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(200).json(user.friends);
  } catch (error) {
    console.error("Failed to fetch friends:", error);
    res.status(500).send({ message: "Error fetching friends", error });
  }
};
