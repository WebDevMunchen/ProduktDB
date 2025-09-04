const {Schema, model} = require("mongoose")

const productSchema = new Schema({
    productNumber: {type: Number, required: true, unique: true},
    title: {type: String, required: true},
    image: {type: String, required: true},
    storageLocation: {type: String, },
    notes: {type: String, },
    relatedProduct: [{type: Schema.Types.ObjectId, ref: "Product"}]
})

const Product = model("Product", productSchema)

module.exports = Product