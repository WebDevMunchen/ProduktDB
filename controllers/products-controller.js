const asyncWrapper = require("../utils/asyncWrapper");
const nodemailer = require("nodemailer");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/user-model");
const Product = require("../models/products-model");

const getAllProducts = asyncWrapper(async (req, res, next) => {
  const products = await Product.find({}).populate("relatedProduct");

  res.status(200).json(products);
});

const getProductList = asyncWrapper(async (req, res, next) => {
  const { skip = 0, limit = 10, search = "" } = req.query;

  const filter = {};

  if (search) {
    if (!isNaN(search)) {
      filter.productNumber = Number(search);
    } else {
      filter.title = { $regex: search, $options: "i" };
    }
  }

  const products = await Product.find(filter)
    .skip(Number(skip))
    .limit(Number(limit))
    .populate("relatedProduct");

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

const getProductPreview = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findById(id).populate("relatedProduct");

  if (!product) {
    throw new ErrorResponse("Product not found!", 404);
  }

  res.status(200).json(product);
});

const deleteProduct = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    throw new ErrorResponse("Product not found!", 404);
  }

  res.status(200).json({ message: "Product deleted!" });
});

const reportMissingPhoto = asyncWrapper(async (req, res, next) => {
  const { productNumber } = req.params;
  const { userId } = req.user;

  const product = await Product.findOne({ productNumber }).populate(
    "relatedProduct"
  );

  const user = await User.findOne({ userId });

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
  product.reportedAt = Date.now();
  product.reportedBy = user.firstName + " " + user.lastName;
  product.currentStatus = "neu";
  product.reportersId = user.userId;
  product.reportersLocation = user.location;
  product.reportersDepartment = user.department;
  await product.save();

  res
    .status(200)
    .json({ message: `Product #${productNumber} reported successfully` });
});

const updateStatus = asyncWrapper(async (req, res, next) => {
  const { currentStatus } = req.body;
  const { id } = req.params;

  const product = await Product.findByIdAndUpdate(id, { currentStatus });

  if (!product) {
    return res.status(404).json({ message: "Product or report not found" });
  }

  res.status(200).json(product);
});

const createProduct = asyncWrapper(async (req, res, next) => {
  const {
    productNumber,
    title,
    image,
    storageLocation,
    notes,
    relatedProduct,
    internProduct,
  } = req.body;

  const findProduct = await Product.findOne({ productNumber });

  if (findProduct) {
    throw new ErrorResponse("Product number already exists!", 409);
  }

  const product = await Product.create({
    productNumber,
    title,
    image,
    storageLocation,
    notes,
    relatedProduct,
    internProduct,
  });

  res.status(201).json(product);
});

const updateProduct = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { productNumber: pNumber } = req.params;
  const {
    productNumber,
    title,
    image,
    storageLocation,
    notes,
    relatedProduct,
    internProduct,
  } = req.body;

  const findProduct = await Product.findOne({ pNumber });

  if (!findProduct) {
    throw new ErrorResponse("Product not found!", 404);
  }

  const updatedProduct = await Product.findByIdAndUpdate(id, {
    productNumber,
    title,
    image,
    storageLocation,
    notes,
    relatedProduct,
    internProduct,
  });

  res.status(201).json(updatedProduct);
});

module.exports = {
  getProductInfo,
  getAllProducts,
  getProductList,
  reportMissingPhoto,
  updateStatus,
  createProduct,
  getProductPreview,
  deleteProduct,
  updateProduct,
};
