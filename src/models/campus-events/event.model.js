// {
//   celebrationId: String,
//   title: String,
//   description: String,
//   date: Date,
//   location: String,
//   createdBy: String,
//   createdAt: Date
// }

import mongoose from "mongoose";

const celebrationSchema = new mongoose.Schema(
  {
    celebrationId: {
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
    date: {
      type: Date,
      required: true,
    },
    location: {
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

const CelebrationModel = mongoose.model(
  "Celebration Details",
  celebrationSchema
);

export default CelebrationModel;
