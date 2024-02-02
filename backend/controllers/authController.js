const User = require("../models/User");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && user.password === password) {
      res.json("exist");
    } else if (user) {
      res.json("incorrect password");
    } else {
      res.json("notexist");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Server error");
  }
};

exports.signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.json("exist");
    } else {
      const newUser = new User({ email, password });
      await newUser.save();
      res.json("notexist");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Server error");
  }
};
