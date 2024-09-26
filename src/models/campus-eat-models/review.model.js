// {
//   reviewId: String,
//   foodItem: String,
//   rating: Number,
//   comment: String,
//   reviewerId: String,
//   canteenId: String,
//   date: Date
// }

import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    foodItem: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    reviewerId: {
      type: String,
      required: true,
    },
    canteenId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ReviewModel = mongoose.model("ReviewDetails", reviewSchema);

export default ReviewModel;
