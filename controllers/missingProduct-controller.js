const asyncWrapper = require("../utils/asyncWrapper");
const nodemailer = require("nodemailer");
const MissingProduct = require("../models/missingProduct-model");

const reportMissingProduct = asyncWrapper(async (req, res, next) => {
  const { productNumber, reportedBy } = req.body;

  const product = await MissingProduct.create({ productNumber, reportedBy });

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

const getAllMissingProductReports = asyncWrapper(async (req, res, next) => {
  const allMissingProductReports = await MissingProduct.find({});

  res.json(allMissingProductReports);
});

const updateStatus = asyncWrapper(async (req, res, next) => {
  const { currentStatus } = req.body;
  const { id } = req.params;

  const product = await MissingProduct.findByIdAndUpdate(
    id,                 // filter
    { currentStatus },           // update
    { new: true }                // return updated document
  );

  if (!product) {
    return res.status(404).json({ message: "Product or report not found" });
  }

  res.status(200).json(product);
});

module.exports = {
  reportMissingProduct,
  getAllMissingProductReports,
  updateStatus
};
