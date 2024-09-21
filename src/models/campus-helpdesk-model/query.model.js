import mongoose from "mongoose";

const querySchema = new mongoose.Schema(
  {
    queryId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const QueryModel = mongoose.model("Query Details", querySchema);

export default QueryModel;
