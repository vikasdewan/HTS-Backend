// {
//   answerId: String,
//   questionId: String,
//   answer: String,
//   answeredBy: String,
//   upvotes: Number,
//   createdAt: Date
// }

import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    answerId: {
      type: String,
      required: true,
    },
    questionId: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    answeredBy: {
      type: String,
      required: true,
    },
    upvotes: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const AnswerModel = mongoose.model("Answer Details", answerSchema);

export default AnswerModel;
