import mongoose, { mongo } from "mongoose";
const chatSchema = new mongoose.Schema(
  {
    chatName: {
      type: String,
      trim: true,
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    profilePic: {
      type: String,
    },
  },
  { timestamps: true }
);

const ChatModel = mongoose.models.Chats || mongoose.model("Chats", chatSchema);

export default ChatModel;
