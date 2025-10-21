const express = require("express");
const {
  getProductInfo,
  getAllProducts,
  reportMissingPhoto,
  reportIssue,
  updateStatus,
} = require("../controllers/products-controller");
const { authenticate } = require("../middlewares/authentication");

const productsRouter = express.Router();

productsRouter.route("/getAllProducts").get(authenticate, getAllProducts);
productsRouter
  .route("/getProductInfo/:productNumber")
  .get(authenticate, getProductInfo);
productsRouter
  .route("/reportMissingPhoto/:productNumber")
  .post(authenticate, reportMissingPhoto);
productsRouter
  .route("/reportIssue/:productNumber")
  .post(authenticate, reportIssue);
productsRouter.put("/reports/:id/updateStatus/:reportId", updateStatus);
module.exports = productsRouter;
