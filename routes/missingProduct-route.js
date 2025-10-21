const express = require("express");

const { authenticate } = require("../middlewares/authentication");
const {
  reportMissingProduct,
  getAllMissingProductReports,
  updateStatus,
} = require("../controllers/missingProduct-controller");

const missingProductRouter = express.Router();

missingProductRouter
  .route("/getAllMissingProductReports")
  .get(authenticate, getAllMissingProductReports);
missingProductRouter
  .route("/reportMissingProduct")
  .post(authenticate, reportMissingProduct);
missingProductRouter.route("/updateStatus/:id").put(authenticate, updateStatus);

module.exports = missingProductRouter;
