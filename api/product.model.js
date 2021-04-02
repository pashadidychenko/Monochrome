const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    summary: { type: Number, required: true },
  },
  { versionKey: false }
);

const productModel = mongoose.model("products", productSchema);

module.exports = productModel;
