import mongoose from "mongoose";
import { Schema } from "mongoose";
const careerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: [true, "Please enter job type "],
      enum: ["Remote", "OnSite"],
    },
    location: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    postedOn: {
      type: Date,
      default: Date.now(),
    },
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    applyLink: {
      type: String,
    },
    college: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const CarrerModel = mongoose.model("CarrerDetails", careerSchema);
export default CarrerModel;
