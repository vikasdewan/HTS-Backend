// {
//   eventId: String,
//   title: String,
//   description: String,
//   location: String,
//   organizer: String,
//   date: Date,
//   createdAt: Date

// }
import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    eventId: {
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
  },
  { timestamps: true }
);

const EventModel = mongoose.model("Event Details", eventSchema);
export default EventModel;
