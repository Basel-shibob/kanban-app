const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userRepo = require("../storage/userRepository.js");

async function registerUser(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }

  const checkEmail = await userRepo.getByEmail(email);
  if (checkEmail) {
    return res.status(409).json({ message: "This email is already registered" });
  }
  const newUser = await userRepo.create({ name, email, password });
  const userToken = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
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
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await userRepo.getByEmailWithPassword(email);
  if (user) {
    const stordHash = user.password;
    const verifyPassword = await bcrypt.compare(password, stordHash);
    if (!verifyPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    } else {
      const userToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
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
