const express = require("express");
const {
  getProductInfo,
  getAllProducts,
  reportMissingPhoto,
  updateStatus,
  getProductList,
  createProduct,
  getProductPreview,
  deleteProduct,
  updateProduct,
} = require("../controllers/products-controller");
const { authenticate, authorize } = require("../middlewares/authentication");

const productsRouter = express.Router();

productsRouter.route("/getAllProducts").get(authenticate, getAllProducts);
productsRouter
  .route("/createProduct")
  .post(authenticate, authorize("mucAdmin"), createProduct);
productsRouter.route("/getProductList").get(authenticate, getProductList);
productsRouter
  .route("/getProductInfo/:productNumber")
  .get(authenticate, getProductInfo);
productsRouter
  .route("/getProductPreview/:id")
  .get(authenticate, getProductPreview);
productsRouter
  .route("/deleteProduct/:id")
  .delete(authenticate, authorize("mucAdmin"), deleteProduct);
productsRouter
  .route("/updateProduct/:id")
  .put(authenticate, authorize("mucAdmin"), updateProduct);
productsRouter
  .route("/reportMissingPhoto/:productNumber")
  .post(authenticate, reportMissingPhoto);
productsRouter.route("/updateStatus/:id").put(authenticate, authorize("mucAdmin"), updateStatus);
module.exports = productsRouter;
