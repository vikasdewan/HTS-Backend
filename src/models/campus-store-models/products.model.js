import mongoose from "mongoose";
import { Schema } from "mongoose";
const productSchema = new mongoose.Schema(
  {
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
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    buyerId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    images: {
      type: [String],
      required: true,
    },
    sold: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const ProductsModel = mongoose.model("Products", productSchema);
export default ProductsModel;
