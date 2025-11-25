const express = require("express");
const {
  register,
  login,
  logout,
  getProfile,
  getAllUsers,
  updatePassword,
  sendActivationEmail,
  activateUser,
  switchUserStatus,
  unlockUserAccount,
} = require("../controllers/user-controller");
const { authenticate } = require("../middlewares/authentication");

const userRouter = express.Router();

userRouter.route("/getAllUsers").get(authenticate, getAllUsers);
userRouter.route("/getProfile").get(authenticate, getProfile);
userRouter.route("/register").post(authenticate, register);
userRouter.route("/login").post(login);
userRouter.route("/logout").post(logout);
userRouter.route("/sendActivation/:id").post(authenticate, sendActivationEmail);
userRouter.route("/activate/:token").get(activateUser);
userRouter.route("/switchUserStatus/:id").put(authenticate, switchUserStatus);
userRouter.route("/unlockUserAccount/:id").put(authenticate, unlockUserAccount);
userRouter.route("/updatePassword/:id").put(authenticate, updatePassword);

module.exports = userRouter;
