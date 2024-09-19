import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    sellerId: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    sold: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: { type: Date, default: Date.now },
    },
  },
  { timestamps: true }
);

const ProductsModel = mongoose.model("Product Details", productSchema);
export default ProductsModel;
