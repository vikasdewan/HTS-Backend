// {
//   questionId: String,
//   title: String,
//   body: String,
//   askedBy: String,
//   createdAt: Date
// }

import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    questionId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    askedBy: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const QuestionModel = mongoose.model("Question Details", questionSchema);

export default QuestionModel;
