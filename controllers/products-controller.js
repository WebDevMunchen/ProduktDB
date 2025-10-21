const Product = require("../models/product-model");
const asyncWrapper = require("../utils/asyncWrapper");
const nodemailer = require("nodemailer");
const ErrorResponse = require("../utils/errorResponse");

const getAllProducts = asyncWrapper(async (req, res, next) => {
  const products = await Product.find({}).populate("relatedProduct");

  res.status(200).json(products);
});

const getProductInfo = asyncWrapper(async (req, res, next) => {
  const { productNumber } = req.params;

  const product = await Product.findOne({
    productNumber: productNumber,
  }).populate("relatedProduct");

  if (!product) {
    throw new ErrorResponse("Product not found!", 404);
  }

  res.status(200).json(product);
});

const reportMissingPhoto = asyncWrapper(async (req, res, next) => {
  const { productNumber } = req.params;

  const product = await Product.findOne({ productNumber }).populate(
    "relatedProduct"
  );

  if (!product) {
    throw new ErrorResponse("Product not found!", 404);
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.USER,
      pass: process.env.APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: {
      name: "Missing Photo",
      address: process.env.USER,
    },
    to: process.env.EMAIL_ISSUE_HANDLER,
    subject: "Missing Photo A",
    text: "Missing Photo B",
    html: `
      <p>The following product is missing a photo:</p>
      <ul>
        <li>Product Number: ${product.productNumber}</li>
      </ul>
      <p>Please update or upload the missing image.</p>
    `,
  };

  await transporter.sendMail(mailOptions);

  product.imageReported = true;
  await product.save();

  res
    .status(200)
    .json({ message: `Product #${productNumber} reported successfully` });
});

const reportIssue = asyncWrapper(async (req, res, next) => {
  const { productNumber } = req.params;
  const { reportedBy, reason } = req.body;

  const product = await Product.findOne({ productNumber });

  if (!product) {
    throw new ErrorResponse("Product not found!", 404);
  }

  product.reportedIssues.push({ reportedBy, reason });
  await product.save();

  res.status(200).json({
    message: `Report added successfully for product #${productNumber}`,
    reportedIssues: product.reportedIssues,
  });
});

const updateStatus = asyncWrapper(async (req, res, next) => {
  const { currentStatus } = req.body;
  const { id, reportId } = req.params;

  const product = await Product.findOneAndUpdate(
    { _id: id, "reportedIssues._id": reportId },
    { $set: { "reportedIssues.$.currentStatus": currentStatus } },
    { new: true }
  );

  if (!product) {
    return res.status(404).json({ message: "Product or report not found" });
  }

  res.status(200).json(product);
});
module.exports = {
  getProductInfo,
  getAllProducts,
  reportMissingPhoto,
  reportIssue,
  updateStatus,
};
