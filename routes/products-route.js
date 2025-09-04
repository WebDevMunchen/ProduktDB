const express = require("express");
const { authenticate } = require("../middlewares/authentication");
const { getProductInfo, getAllProducts, reportMissingPhoto } = require("../controllers/products-controller");

const productsRouter = express.Router();

productsRouter.route("/getAllProducts").get(getAllProducts)
productsRouter.route("/getProductInfo/:productNumber").get(getProductInfo);
productsRouter.route("/reportMissingPhoto/:productNumber").post(reportMissingPhoto);

module.exports = productsRouter;
