const { Schema, model } = require("mongoose");

const productReportsSchema = new Schema({
  reportedAt: { type: Date, default: Date.now },
  reportedBy: { type: String, required: true },
  reportersId: { type: Number },
  reportersLocation: { type: String },
  reportersDepartment: { type: String },
  productNumber: { type: Number, required: true },
  message: { type: String },
  reportType: {
    type: String,
    enum: ["Meldung", "Fehlender Artikel"],
    default: "Fehlender Artikel",
    required: true,
  },
  currentStatus: {
    type: String,
    enum: ["neu", "erledigt", "in Arbeit", "irrelevant"],
    default: "neu",
    required: true,
  },
});

const ProductReports = model("ProductReport", productReportsSchema);

module.exports = ProductReports;
