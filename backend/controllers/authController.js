const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.login = async (req, res) => {
  const { emailOrUsername, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        message: "exist",
        isAdmin: user.isAdmin,
      });
    } else if (user) {
      res.json({ message: "incorrect password" });
    } else {
      res.json({ message: "notexist" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Server error");
  }
};

exports.signup = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    const existingUsername = await User.findOne({ username });

    if (existingUser) {
      res.json("exist");
    } else if (existingUsername) {
      res.json("username unavailable");
    } else {
      const newUser = new User({ email, username, password });
      await newUser.save();
      res.json("notexist");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Server error");
  }
};
