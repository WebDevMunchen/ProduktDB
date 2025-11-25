const { Schema, model } = require("mongoose");

const productSchema = new Schema({
  productNumber: { type: Number, required: true, unique: true },
  internProduct: {type: Boolean, require: true, default: false},
  title: { type: String, required: true },
  image: { type: String, required: true },
  imageReported: { type: Boolean, default: false },
  storageLocation: { type: String },
  notes: { type: String },
  reportedAt: { type: Date },
  reportedBy: { type: String },
  currentStatus: {
    type: String,
    enum: ["neu", "erledigt", "in Arbeit", "irrelevant"],
  },
  relatedProduct: [{ type: Schema.Types.ObjectId, ref: "Product" }],
});

const Product = model("Product", productSchema);

module.exports = Product;
