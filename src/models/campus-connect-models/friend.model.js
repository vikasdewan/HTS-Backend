// {
//   userId: String,
//   friends: [String]
// }

import mongoose from "mongoose";
import { Schema } from "mongoose";
const friendSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
       ref: "UserModel",
       required:true,
    },
    friends: {
      type: [Schema.Types.ObjectId],
      required: true,
    },
  },
  { timestamps: true }
);

const FriendModel = mongoose.model("Friend Details", friendSchema);
export default FriendModel;
