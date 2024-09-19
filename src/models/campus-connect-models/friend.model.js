// {
//   userId: String,
//   friends: [String]
// }

import mongoose from "mongoose";

const friendSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    friends: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

const FriendModel = mongoose.model("Friend Details", friendSchema);
export default FriendModel;
