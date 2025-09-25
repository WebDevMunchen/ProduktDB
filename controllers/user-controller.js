const User = require("../models/user-model");
const asyncWrapper = require("../utils/asyncWrapper");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/errorResponse");

const register = asyncWrapper(async (req, res, next) => {
  const { userId, password } = req.body;

  const user = await User.findOne({ userId });

  if (user) {
    throw new ErrorResponse("User already exists!", 409);
  }

  const newUser = await User.create({ userId, password });

  res.status(201).json(newUser);
});

const login = asyncWrapper(async (req, res, next) => {
  const { userId, password } = req.body;

  const user = await User.findOne({ userId }).select("+password");

  if (!user) {
    throw new ErrorResponse("User not found!", 404);
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new ErrorResponse("Incorrect password!", 403);
  }

  const payload = { id: user._id, userId: user.userId, role: user.role };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "480m",
  });

  res
    .cookie("access_token", token, { httpOnly: true, maxAge: 7200000 })
    .json(payload);
});

const logout = asyncWrapper(async (req, res, next) => {
  res
    .cookie("access_token", "", { httpOnly: true, maxAge: 0 })
    .json({ message: "Success!" });
});

const getProfile = asyncWrapper(async (req, res, next) => {
  const { id } = req.user;

  const user = await User.findById(id);

  if (!user) {
    throw new ErrorResponse("User not found!", 404);
  }

  res.json(user);
});

module.exports = {
  register,
  login,
  logout,
  getProfile,
};
