const Product = require("../models/product-model");
const asyncWrapper = require("../utils/asyncWrapper");
const ErrorResponse = require("../utils/errorResponse");
const nodemailer = require("nodemailer");

const getAllProducts = asyncWrapper(async (req, res, next) => {
  const products = await Product.find({}).populate("relatedProduct");

  res.status(200).json(products);
});

const getProductInfo = asyncWrapper(async (req, res, next) => {
  const { productNumber } = req.params;

  const product = await Product.findOne({ productNumber: productNumber }).populate("relatedProduct");

  if (!product) {
    throw new ErrorResponse("Product not found!", 404);
  }

  res.status(200).json(product);
});

const reportMissingPhoto = asyncWrapper(async (req, res, next) => {
  const { productNumber } = req.params;

  const product = await Product.findOne({ productNumber }).populate("relatedProduct");

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
    to: `denis.hadzipasic@rent.group`,
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

  // ✅ Send email
  await transporter.sendMail(mailOptions);

  res.status(200).json({ message: `Product #${productNumber} reported successfully` });
});


module.exports = {
  getProductInfo,
  getAllProducts,
  reportMissingPhoto
};
