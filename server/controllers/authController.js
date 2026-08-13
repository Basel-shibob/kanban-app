const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function registerUser(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please send valid data !" });
  }

  const checkEmail = await User.findOne({ email });
  if (checkEmail) {
    return res.status(400).json({ message: "ALREADY_EXISTS" });
  }
  const newUser = new User({
    name,
    email,
    password,
  });

  await newUser.save();
  const userToken = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return res.status(201).json({
    message: "New user created",
    name: name,
    email: email,
    userToken: userToken,
  });
}

async function loginUser(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Please send valid data !" });
  }

  const user = await User.findOne({ email });
  if (user) {
    const stordHash = user.password;
    const verifyPassword = await bcrypt.compare(password, stordHash);
    if (!verifyPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    } else {
      const userToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.status(200).json({ userToken: userToken });
    }
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
}

const verifyToken = async (req, res) => {
  return res.status(200).json({ valid: true, user: req.user });
};

module.exports = { registerUser, loginUser, verifyToken };
