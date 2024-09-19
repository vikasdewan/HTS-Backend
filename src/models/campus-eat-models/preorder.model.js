// {
//   orderId: String,
//   userId: String,
//   canteenId: String,
//   items: [String],
//   totalAmount: Number,
//   status: String,
//   orderTime: Date
// }

import mongoose from "mongoose";

const preorderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    canteenId: {
      type: String,
      required: true,
    },
    items: {
      type: [String],
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const PreorderModel = mongoose.model("Preorder Details", preorderSchema);

export default PreorderModel;
