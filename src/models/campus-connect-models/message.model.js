// {
//   messageId: String,
//   senderId: String,
//   receiverId: String,
//   message: String,
//   timestamp: Date
// }

import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    messageId: {
      type: String,
      required: true,
    },
    senderId: {
      type: String,
      required: true,
    },
    receiverId: {
      type: String,
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
