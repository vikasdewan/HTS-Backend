import mongoose from "mongoose";
import { Schema } from "mongoose";

const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: "UserModel",
      required: true,
    },
    college: {
      type: String,
      required: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "UserModel",
      },
    ],
    comments: [
      {
        commentText: {
          type: String,
          required: true,
        },
        commentedBy: {
          type: Schema.Types.ObjectId,
          ref: "UserModel",
          required: true,
        },
        commentedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    postImage: {
      type: String, // Cloudinary URL 
    },
  },
  { timestamps: true }
);

const PostModel = mongoose.model("Post Details", postSchema);
export default PostModel;
