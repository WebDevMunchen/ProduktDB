const express = require("express");
const {
  register,
  login,
  logout,
  getProfile,
  getAllUsers,
} = require("../controllers/user-controller");
const { authenticate } = require("../middlewares/authentication");

const userRouter = express.Router();

userRouter.route("/getAllUsers").get(authenticate, getAllUsers);
userRouter.route("/getProfile").get(authenticate, getProfile);
userRouter.route("/register").post(authenticate, register);
userRouter.route("/login").post(login);
userRouter.route("/logout").post(logout);

module.exports = userRouter;
