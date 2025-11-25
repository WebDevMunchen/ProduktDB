const express = require("express");
const {
  getProductInfo,
  getAllProducts,
  reportMissingPhoto,
  reportIssue,
  updateStatus,
  getProductList,
  createProduct,
  getProductPreview,
  deleteProduct,
  updateProduct,
} = require("../controllers/products-controller");
const { authenticate } = require("../middlewares/authentication");

const productsRouter = express.Router();

productsRouter.route("/getAllProducts").get(authenticate, getAllProducts);
productsRouter.route("/createProduct").post(authenticate, createProduct);
productsRouter.route("/getProductList").get(authenticate, getProductList);
productsRouter
  .route("/getProductInfo/:productNumber")
  .get(authenticate, getProductInfo);
productsRouter
  .route("/getProductPreview/:id")
  .get(authenticate, getProductPreview);
productsRouter
  .route("/deleteProduct/:id")
  .delete(authenticate, deleteProduct);
  productsRouter
  .route("/updateProduct/:id")
  .put(authenticate, updateProduct);
productsRouter
  .route("/reportMissingPhoto/:productNumber")
  .post(authenticate, reportMissingPhoto);
productsRouter
  .route("/reportIssue/:productNumber")
  .post(authenticate, reportIssue);
productsRouter.put("/updateStatus/:id", updateStatus);
module.exports = productsRouter;
