import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import UserModel from "../models/campus-connect-models/user.model.js";
import AdminModel from "../models/campus-connect-models/admin.model.js";

// Middleware to verify both users and admins
export const verifyJWT = (entity = "user") =>
  asyncHandler(async (req, _, next) => {
    try {
      const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

      if (!token) {
        throw new ApiError(401, "Unauthorized request");
      }

      // Verify the JWT token
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      // Determine if we're verifying an admin or a user
      let authenticatedEntity;
      if (entity === "admin") {
        authenticatedEntity = await AdminModel.findById(
          decodedToken?._id
        ).select("-password");
        if (!authenticatedEntity) {
          throw new ApiError(
            401,
            "Unauthorized request - Invalid Admin Access Token"
          );
        }
        req.admin = authenticatedEntity; // Attach the admin to the request
      } else {
        authenticatedEntity = await UserModel.findById(
          decodedToken?._id
        ).select("-password");
        if (!authenticatedEntity) {
          throw new ApiError(
            401,
            "Unauthorized request - Invalid User Access Token"
          );
        }
        req.user = authenticatedEntity; // Attach the user to the request
      }

      next();
    } catch (error) {
      throw new ApiError(401, error?.message || "Invalid Access Token");
    }
  });
