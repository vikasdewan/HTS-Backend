import { Schema } from "mongoose";
import mongoose from "mongoose";

const preorderSchema = new mongoose.Schema(
  {
    orderedBy: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    canteenId: {
      type: String,
      required: true,
    },
    items: {
      type: [],
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

const PreorderModel = mongoose.model("PreorderDetails", preorderSchema);

export default PreorderModel;
