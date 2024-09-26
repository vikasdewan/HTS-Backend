import mongoose, { Schema, model } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const adminSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      validate: [validator.isEmail, "Provide a valid email"],
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: [8, "Password Contain at least 8 character"],
    },
    college: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
);



adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10); //10 is a round's of hashing
  console.log("this.password at presave ", this.password);
  next();
});

//user defined method in schema like this ...
adminSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password); //password by user and this.password
  //refers to the password which is saved in the jsonwebtoken
};
  //jwt - json web token
  adminSchema.methods.genrateAccessToken = function () {
    //how many things to be saved as a jwt here used as access token
    return jwt.sign(
      {
        _id: this._id,
        email: this.email,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      }
    );
  };
  const AdminModel = model("AdminModel", adminSchema);
  export default AdminModel;