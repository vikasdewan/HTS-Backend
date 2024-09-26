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
      ref: "Users",
      required: true,
    },
    applyLink: {
      type: String,
    },
    poster: {
      type: String, //cloudinary url
    },
    college: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const EventModel = mongoose.model("Event Details", eventSchema);
export default EventModel;
