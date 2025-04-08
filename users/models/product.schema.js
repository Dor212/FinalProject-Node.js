import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: String,
    image: String,
    price: Number,
    sizes: [String],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
