const { Schema, model } = require("mongoose");

const missingProductSchema = new Schema({
  reportedAt: { type: Date, default: Date.now },
  reportedBy: { type: String, required: true },
  productNumber: { type: Number, required: true },
  currentStatus: {
    type: String,
    enun: ["neu", "erledigt", "in Arbeit", "irrelevant"],
    default: "neu",
    required: true,
  },
});

const MissingProduct = model("MissingProduct", missingProductSchema);

module.exports = MissingProduct;
