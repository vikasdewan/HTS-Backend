import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

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
      unique:true,
      required: true,
    },
    rollnum:{
      type:Number,
      unique:true,
      required:true
    },
    course: {
      type: String,
      required: true,
    },
    branch_section:{
      type:String,
      required:true
    },
    year: {
      type: Number,
      required: true,
    },
    bio: {
      type: String,
      min:30
    },
    interests: {
      type: [String],
    },
    profileImage: {
      type: String,
    },

  },
  { timestamps: true }
);

userSchema.pre("save", async function(next){
  if(!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);//10 is a round's of hashing
  console.log("this.password at presave ",this.password);
  next()
})

//user defined method in schema like this ...
userSchema.methods.isPasswordCorrect = async function(password){
  return await bcrypt.compare(password,this.password)//password by user and this.password
  //refers to the password which is saved in the jsonwebtoken
}
//jwt - json web token
userSchema.methods.genrateAccessToken = function(){
  //how many things to be saved as a jwt here used as access token
  return jwt.sign({
    _id: this._id,
    userId: this.userId,
    name: this.name
  },
  process.env.ACCESS_TOKEN_SECRET ,
  {
    expiresIn:process.env.ACCESS_TOKEN_EXPIRY 
  }
)
}

userSchema.methods.genrateRefreshToken = function(){
  return jwt.sign({
    _id: this._id,
   },
  process.env.REFRESH_TOKEN_SECRET ,
  {
    expiresIn:process.env.REFRESH_TOKEN_EXPIRY 
  }
)
}


const UserModel = mongoose.model("User Details", userSchema);
export default UserModel;
