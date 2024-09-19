// {
//   userId: String,
//   answerId: String,
//   vote: Number // 1 for upvote, -1 for downvote
// }

import mongoose from "mongoose";

const voteSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    answerId: {
      type: String,
      required: true,
    },
    vote: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const VoteModel = mongoose.model("Vote Details", voteSchema);

export default VoteModel;
