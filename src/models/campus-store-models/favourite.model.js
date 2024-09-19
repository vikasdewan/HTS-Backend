import mongoose from "mongoose";

const favouriteSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    productIds: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

const FavouriteModel = mongoose.model("Favourite Details", favouriteSchema);
export default FavouriteModel;
