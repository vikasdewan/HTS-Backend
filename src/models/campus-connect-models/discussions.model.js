import mongoose from "mongoose";
import { Schema } from "mongoose";
const discussionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    messages: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      required: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const DiscussionModel = mongoose.model("Discussion Details", discussionSchema);
export default DiscussionModel;
