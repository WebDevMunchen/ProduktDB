const {Schema, model} = require("mongoose")

const reportSchema = new Schema(
  {
    reportedAt: { type: Date, default: Date.now }, 
    reportedBy: { type: String, required: true},                  
    reason: { type: String, required: true }, 
    currentStatus: { type: String, enum: ["neu", "erledigt", "in Arbeit", "irrelevant"], default: "neu", required: true }, 
  },
);

const productSchema = new Schema({
    productNumber: {type: Number, required: true, unique: true},
    title: {type: String, required: true},
    image: {type: String, required: true},
    imageReported: {type: Boolean, default: false}, 
    storageLocation: {type: String, },
    notes: {type: String, },
    relatedProduct: [{type: Schema.Types.ObjectId, ref: "Product"}],
    reportedIssues: [reportSchema]
})

const Product = model("Product", productSchema)

module.exports = Product