import mongoose from "mongoose";

const menuSchema = new mongoose.Schema(
  {
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
    offer: {
      type: String,
    },
    review: {
      type: String,
    },
  },
  { timestamps: true }
);

const MenuModel = mongoose.model("MenuDetails", menuSchema);

export default MenuModel;
