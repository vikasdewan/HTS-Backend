// {
//   discussionId: String,
//   title: String,
//   description: String,
//   createdBy: String,
//   createdAt: Date
// }

import mongoose from "mongoose";

const discussionSchema = new mongoose.Schema(
  {
    discussionId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
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
