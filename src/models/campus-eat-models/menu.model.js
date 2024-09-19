// {
//   menuId: String,
//   canteenId: String,
//   foodItems: [String],
//   price: Number,
//   date: Date
// }

import mongoose from "mongoose";

const menuSchema = new mongoose.Schema(
  {
    menuId: {
      type: String,
      required: true,
    },
    canteenId: {
      type: String,
      required: true,
    },
    foodItems: {
      type: [String],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const MenuModel = mongoose.model("Menu Details", menuSchema);

export default MenuModel;
