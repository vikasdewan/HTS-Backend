// {
//   notificationId: String,
//   userId: String,
//   message: String,
//   read: Boolean,
//   createdAt: Date
// }

import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    notificationId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

const NotificationModel = mongoose.model(
  "Notification Details",
  notificationSchema
);

export default NotificationModel;
