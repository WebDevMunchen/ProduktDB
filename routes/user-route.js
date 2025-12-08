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
  getUserInfo,
  updateUser,
} = require("../controllers/user-controller");
const { authenticate, authorize } = require("../middlewares/authentication");

const userRouter = express.Router();

userRouter
  .route("/getAllUsers")
  .get(authenticate, authorize("mucAdmin"), getAllUsers);
userRouter.route("/getProfile").get(authenticate, getProfile);
userRouter
  .route("/register")
  .post(authenticate, authorize("mucAdmin"), register);
userRouter.route("/login").post(login);
userRouter.route("/logout").post(logout);
userRouter
  .route("/sendActivation/:id")
  .post(authenticate, authorize("mucAdmin"), sendActivationEmail);
userRouter.route("/activate/:token").get(activateUser);
userRouter
  .route("/getUserInfo/:id")
  .get(authenticate, authorize("mucAdmin"), getUserInfo);
userRouter
  .route("/updateUser/:id")
  .put(authenticate, authorize("mucAdmin"), updateUser);
userRouter
  .route("/updatePassword/:id")
  .put(authenticate, authorize("mucAdmin"), updatePassword);

module.exports = userRouter;
