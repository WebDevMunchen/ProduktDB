const User = require("../models/user-model");
const asyncWrapper = require("../utils/asyncWrapper");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/errorResponse");
const nodemailer = require("nodemailer");
const createActivationToken = require("../utils/activiationToken");
const register = asyncWrapper(async (req, res, next) => {
  const {
    userId,
    password,
    firstName,
    lastName,
    department,
    location,
    email,
    role,
  } = req.body;

  const user = await User.findOne({ userId });

  if (user) {
    throw new ErrorResponse("User already exists!", 409);
  }

  const newUser = await User.create({
    userId,
    password,
    firstName,
    lastName,
    department,
    location,
    email,
    role,
  });

  const token = createActivationToken(newUser);

  const activationLink = `${process.env.FRONTEND_URL}/api/user/activate/${token}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER,
      pass: process.env.APP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"noreply - Artikeldatenbank - Rent.Group" <${process.env.EMAIL_USER}>`,
    to: newUser.email,
    subject: "Aktivierung Ihres Zugangs",
    html: `
      <p>Hallo ${newUser.firstName},</p>
      <p>Klicken Sie auf den folgenden Link, um Ihren Zugang zu aktivieren:</p>
      <a href="${activationLink}">${activationLink}</a>
      <p>Dieser Link ist nur 1 Stunde gültig.</p>
    `,
  });

  res.status(201).json(newUser);
});

const login = asyncWrapper(async (req, res, next) => {
  const { userId, password } = req.body;

  const user = await User.findOne({ userId }).select("+password");

  if (!user) {
    throw new ErrorResponse("User not found!", 404);
  }

  if (user.status === "gesperrt") {
    throw new ErrorResponse("Account locked!", 423);
  } else if (user.status === "ausstehend") {
    throw new ErrorResponse("Account not verified!", 401);
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    user.failCount++;

    if (user.failCount === 5) user.status = "gesperrt";

    await user.save();

    throw new ErrorResponse("Incorrect password!", 403);
  }

  const payload = { id: user._id, userId: user.userId, role: user.role };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "480m",
  });

  res
    .cookie("access_token", token, { httpOnly: true, maxAge: 7200000 })
    .json(payload);

  user.failCount = 0;
  await user.save();
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

const getAllUsers = asyncWrapper(async (req, res, next) => {
  const { search, location } = req.query;

  let filter = {};

  if (search) {
    filter.$or = [
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
    ];
  }

  if (location && location !== "") {
    filter.location = location;
  }

  const allUsers = await User.find(filter);

  res.status(200).json(allUsers);
});

const switchUserStatus = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id);

  let userStatus = "";

  if (user.status === "aktiv") {
    userStatus = "inaktiv";
  } else {
    userStatus = "aktiv";
  }

  const updatedUser = await User.findByIdAndUpdate(
    id,
    { status: userStatus },
    { new: true }
  );

  if (!user) {
    throw new ErrorResponse("User not found!", 404);
  }

  res.status(200).json({
    message: "User status updated to inaktiv successfully!",
    updatedUser,
  });
});

const unlockUserAccount = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    throw new ErrorResponse("User not found!", 404);
  }
  const updatedUser = await User.findByIdAndUpdate(
    id,
    { status: "aktiv" },
    { new: true }
  );

  res.status(200).json({
    message: "User status updated to inaktiv successfully!",
    updatedUser,
  });
});

const updatePassword = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;

  const { password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const update = { password: hashedPassword };

  const user = await User.findByIdAndUpdate(id, update, { new: true });

  if (!user) {
    throw new ErrorResponse(404, "User not found!");
  }

  res.status(200).json({ message: "Password updated successfully" });
});

const sendActivationEmail = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) {
    throw new ErrorResponse("User not found!", 404);
  }

  if (user.status !== "ausstehend") {
    throw new ErrorResponse("User already actived or blocked!", 400);
  }

  const token = createActivationToken(user);

  const activationLink = `${process.env.FRONTEND_URL}/api/user/activate/${token}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER,
      pass: process.env.APP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"noreply - Artikeldatenbank - Rent.Group" <${process.env.USER}>`,
    to: user.email,
    subject: "Aktivierung Ihres Zugangs",
    html: `
      <p>Hallo ${user.firstName},</p>
      <p>Klicken Sie auf den folgenden Link, um Ihren Zugang zu aktivieren:</p>
      <a href="${activationLink}">${activationLink}</a>
      <p>Dieser Link ist nur 1 Stunde gültig.</p>
    `,
  });

  res.status(200).json({
    success: true,
    message: "Activation email sent.",
  });
});

const activateUser = asyncWrapper(async (req, res, next) => {
  const { token } = req.params;

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.ACTIVATION_SECRET);
  } catch (err) {
  res.redirect(`http://localhost:5173/activation-expired`);

    throw new ErrorResponse("Invalid or expired activation token!", 400);
  }

  const user = await User.findOne({ userId: decoded.userId });
  if (!user) {
    throw new ErrorResponse("User not found!", 404);
  }

  if (user.status !== "ausstehend") {
  res.redirect(`http://localhost:5173/activation-error`);

    throw new ErrorResponse("User already active or blocked!", 400);
  }

  user.status = "aktiv";
  await user.save();

  res.redirect(`http://localhost:5173/activation-success`);
});

module.exports = {
  register,
  login,
  logout,
  getProfile,
  getAllUsers,
  switchUserStatus,
  updatePassword,
  sendActivationEmail,
  activateUser,
  unlockUserAccount,
};
