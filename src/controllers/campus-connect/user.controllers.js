import UserModel from "../../models/campus-connect-models/user.model.js";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";

//Genrating Access Token
const genratingAccessToken = async (userId) => {
  try {
    const user = await UserModel.findById(userId);

    const accessToken = user.genrateAccessToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken };
  } catch (error) {
    throw new ApiError(500, "Error while genrating access  token");
  }
};

//option for cookies 
const options = {
    httpOnly:true,
    secure:true
 }

//User Registration
const registerUser = asyncHandler(async (req, res) => {
  //get data from user
  const {
    username,
    name,
    email,
    rollnum,
    password,
    course,
    branch_section,
    year,
  } = req.body;
  //check for data availability
  if (
    !(
      username &&
      name &&
      email &&
      rollnum &&
      course &&
      branch_section &&
      year &&
      password
    )
  ) {
    throw new ApiError(404, "All Fields are required for registration");
  }
  //check for existing user
  const existedUser = await User.findOne({
    $or: [{ username }, { email }, { rollnum }],
  });
  if (existedUser) {
    throw new ApiError(409, "Username or Email or Roll Number Already Exist");
  }

  profileImageLocalPath = req.files?.profileImage[0]?.path;
  let profileImage;
  if (profileImageLocalPath) {
    profileImage = await uploadOnCloudinary(profileImageLocalPath);
  }
  try {
    const user = await UserModel.create({
      username,
      name,
      email,
      rollnum,
      course,
      branch_section,
      year,
      password,
      profileImage: profileImage?.secure_url || "",
    });

    const newUser = await UserModel.findById(user._id).select("-password");
    if (!newUser) {
      throw new ApiError(500, "Error while registering the user");
    }

    return res
      .status(201)
      .json(new ApiResponse(201, newUser, "User Registered Successfully"));
  } catch (error) {
    return res.status(500).json({ message: "Internal server error occured" });
  }
});

//User Login
const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password, rollnum } = req.body;

  if (!(username || email || rollnum)) {
    throw new ApiError(400, "Enter username or email or Roll Number ");
  }
  const user = await UserModel.findOne({
    $or: [{ username }, { email }, { rollnum }],
  });

  if (!user) {
    throw new ApiError(400, "Register first to Login");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(400, "Incorrect Password");
  }

  const { accessToken } = await genratingAccessToken(user._id);

  //user without password and refreshToken Details
  const loggedInUser = await UserModel.findById(user._id).select("-password ");

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
        },
        "User Logged In Successfully"
      )
    );
});

export {registerUser,loginUser}
