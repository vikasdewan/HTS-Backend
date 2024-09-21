import mongoose from "mongoose";
import { Schema } from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
 
    productId: {
      type: String,
      required: true,
    },
    buyerId: {
      type: Schema.Types.ObjectId,
       ref: "UserModel",
       required:true
    },
    sellerId: {
      type: Schema.Types.ObjectId,
       ref: "UserModel",
       required:true
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const PaymentModel = mongoose.model("Payment Details", paymentSchema);
export default PaymentModel;
