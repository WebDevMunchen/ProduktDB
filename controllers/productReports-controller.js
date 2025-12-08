const asyncWrapper = require("../utils/asyncWrapper");
const nodemailer = require("nodemailer");
const User = require("../models/user-model");
const ErrorResponse = require("../utils/errorResponse");
const ProductReports = require("../models/productReports-model");

const reportMissingProduct = asyncWrapper(async (req, res, next) => {
  const { productNumber, reportedBy } = req.body;
  const { userId } = req.user;

  const user = await User.findOne({ userId });

  if (!user) {
    throw new ErrorResponse("User not found!", 404);
  }

  const product = await ProductReports.create({
    productNumber,
    reportedBy,
    reportersId: user.userId,
    reportersLocation: user.location,
    reportersDepartment: user.department,
  });

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
      <p>${product.reportedBy} says that the following product is missing in the database:</p>
      <ul>
        <li>${product.productNumber}</li>
      </ul>
    `,
  };

  await transporter.sendMail(mailOptions);

  res
    .status(200)
    .json({ message: `Product #${productNumber} reported successfully` });
});

const reportIssue = asyncWrapper(async (req, res, next) => {
  const { message, productNumber } = req.body;
  const { userId } = req.user;

  const user = await User.findOne({ userId });

  if (!user) {
    throw new ErrorResponse("User not found!", 404);
  }

  const product = await ProductReports.create({
    productNumber: productNumber,
    reportedBy: user.firstName + " " + user.lastName,
    reportersId: user.userId,
    reportersLocation: user.location,
    reportersDepartment: user.department,
    reportType: "issue",
    message,
  });

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
      <p>${product.reportedBy} says that the following product is having misleading information:</p>
      <ul>
        <li>${product.productNumber}</li>
      </ul>
    `,
  };

  await transporter.sendMail(mailOptions);

  res
    .status(200)
    .json({ message: `Product #${productNumber} reported successfully` });
});

const getAllProductReports = asyncWrapper(async (req, res, next) => {
  const allProductReports = await ProductReports.find({});

  res.json(allProductReports);
});

const updateStatus = asyncWrapper(async (req, res, next) => {
  const { currentStatus } = req.body;
  const { id } = req.params;

  const product = await ProductReports.findByIdAndUpdate(
    id,
    { currentStatus },
    { new: true }
  );

  if (!product) {
    return res.status(404).json({ message: "Product or report not found" });
  }

  res.status(200).json(product);
});

module.exports = {
  reportMissingProduct,
  getAllProductReports,
  updateStatus,
  reportIssue,
};
