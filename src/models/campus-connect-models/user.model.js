import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Schema } from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      validate: [validator.isEmail, "Provide a valid email"],
    },
    password: {
      type: String,
      required: true,
      minLength: [8, "Password Should be at least 8 marks"],
    },
    rollnum: {
      type: Number,
      unique: true,
      required: true,
    },
    college: {
      type: String,
      required: true,
    },
    course: {
      type: String,
      required: true,
    },
    branch_section: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4],
    },
    bio: {
      type: String,
      minLength: [30, "Bio length atleast contain 30 characters"],
    },
    interests: {
      type: [String],
    },
    profileImage: {
      type: String,
    },
    isEventOrganizer: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isAppliedForEventOrganizer: {
      type: Boolean,
      default: false,
    },
    reportCount: {
      type: Number,
      default: 0,
    },
    // Friend relationships
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "Users", // Reference to another User document
      },
    ],
    isAdmin: {
      type: Boolean,
      default:false
    },
    // Friend requests - Array of user IDs for pending requests
    friendRequests: [
      {
        type: Schema.Types.ObjectId,
        ref: "Users", // User who sent the request
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10); //10 is a round's of hashing
  console.log("this.password at presave ", this.password);
  next();
});

//user defined method in schema like this ...
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password); //password by user and this.password
  //refers to the password which is saved in the jsonwebtoken
};
//jwt - json web token
userSchema.methods.genrateAccessToken = function () {
  //how many things to be saved as a jwt here used as access token
  return jwt.sign(
    {
      _id: this._id,
      name: this.name,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

const UserModel = mongoose.model("Users", userSchema);
export default UserModel;
