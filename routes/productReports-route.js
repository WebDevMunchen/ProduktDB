const express = require("express");

const { authenticate, authorize } = require("../middlewares/authentication");
const { reportMissingProduct, reportIssue, updateStatus, getAllProductReports } = require("../controllers/productReports-controller");

const productReportsRouter = express.Router();

productReportsRouter
  .route("/getAllProductReports")
  .get(authenticate, getAllProductReports);
productReportsRouter
  .route("/reportMissingProduct")
  .post(authenticate, reportMissingProduct);
  productReportsRouter
  .route("/reportIssue/:id")
  .post(authenticate, reportIssue);
productReportsRouter
  .route("/updateStatus/:id")
  .put(authenticate, authorize("mucAdmin"), updateStatus);

module.exports = productReportsRouter;
