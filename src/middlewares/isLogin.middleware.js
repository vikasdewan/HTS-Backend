import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import UserModel from "../models/campus-connect-models/user.model.js";
import AdminModel from "../models/campus-connect-models/admin.model.js";

export const verifyJWT = asyncHandler(async (req,_,next)=>{
   try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer","")
 
    if(!token){
     throw new ApiError(401,"Unauthorized request")
    }
 
  const decodedToken =   jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
 
  const user = await UserModel.findById(decodedToken?._id).select("-password")
  const admin = await AdminModel.findById(decodedToken?._id).select("-password")
 
  if(!user && !admin){
     throw new ApiError(401,"Unauthorized request Invalid Access Token")
  }
  req.user = user;
  req.admin = admin;
  next()
   } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token")
   }
})