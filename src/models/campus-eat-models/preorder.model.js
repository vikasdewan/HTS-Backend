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
    
    orderedBy: {
      type: Schema.Types.ObjectId,
      ref: "UserModel",
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
    quantity:{
      type:Number,
      default:1
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

const PreorderModel = mongoose.model("Preorder Details", preorderSchema);

export default PreorderModel;
