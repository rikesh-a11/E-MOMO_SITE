const mongoose = require("mongoose");
const { reviewSchema } = require("./nextReviewModel");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    productName: {
      type: String,
      required: [true, "productName must be provided"],
    },
    productDescription: {
      type: String,
      required: [true, "Description must be provided"],
    },
    productStockQty: {
      type: Number,
      required: [true, "ProductQuantity must be provided"],
    },
    productPrice: {
      type: Number,
      required: [true, "productPrice must be provided"],
    },
    productStatus: {
      type: String,
      required: ["available", "unavailable"],
    },
    productImage: {
      type : String,
    },
    // reviews : [reviewSchema]
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
