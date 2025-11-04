const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const register = async (req, res) => {
  const { username, password, fullname, email, country, income_bracket } =
    req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const data = [
      username,
      hashedPassword,
      fullname,
      email,
      country,
      income_bracket,
    ];

    User.createUser(data, (err, result) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ message: "Error creating account", error: err });
      }
      return res.status(201).json({ message: "Account created successfully" });
    });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

const login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  User.findUserByUsername(username, async (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (results.length === 0)
      return res.status(404).json({ message: "User not found" });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.status(401).json({ message: "Incorrect password" });

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        fullname: user.fullname,
      },
      token,
    });
  });
};

module.exports = {
  register,
  login,
};