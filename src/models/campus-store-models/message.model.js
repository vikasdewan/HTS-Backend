// {
//   messageId: String,
//   productId: String,
//   senderId: String,
//   receiverId: String,
//   message: String,
//   timestamp: Date
// }
import mongoose from "mongoose";
import { Schema } from "mongoose";
const messageSchema = new mongoose.Schema(
  {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "ProductsModel",
     
    },
    senderId: {
      type: Schema.Types.ObjectId,
       ref: "UserModel",
      required: true,

    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "UserModel",
      required: true,

    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const MessageModel = mongoose.model("Message Details", messageSchema);
export default MessageModel;
