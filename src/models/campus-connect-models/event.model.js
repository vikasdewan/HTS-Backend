import mongoose from "mongoose";
import { Schema } from "mongoose";
const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    organizer: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: "UserModel",
      required: true,
    },
    applyLink: {
      type: String,
    },
  },
  { timestamps: true }
);

const EventModel = mongoose.model("Event Details", eventSchema);
export default EventModel;
