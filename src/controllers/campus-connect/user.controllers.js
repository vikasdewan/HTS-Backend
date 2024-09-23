import UserModel from "../../models/campus-connect-models/user.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";

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

const options = {
  httpOnly: true,
  secure: true,
};

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

  const profileImageLocalPath = req.files?.profileImage[0]?.path;
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
      .json(new ApiResponse(201, {newUser}, "User Registered Successfully"));
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

//User Logout
const logoutUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, "User LoggedOut SuccessFully"));
});

//Password Changing
const changeCurrentPassword = asyncHandler(async (req, res) => {
  //taking input from user
  const { oldPassword, newPassword } = req.body;
  const user = await UserModel.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Old password is incorrect");
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(201, {}, "Password Changed Successfully"));
});

//User Profile
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.user?._id);
  return res
    .status(200)
    .json(new ApiResponse(201, { user }, "current user fetched successfully"));
});

//Get All User (for listing only not for use in website)
const getAllUser = asyncHandler(async (req,res)=>{
  const users = await UserModel.find();
  return res
  .status(200)
  .json(new ApiResponse(201,{users},"All User Fetched Successfully"));
})

// Get All Users of Same College
const getAllUserOfCollage = asyncHandler(async (req, res) => {
  const userId = req.user?._id; // Get the current user's ID

  if (!userId) {
    throw new ApiError(404, "Student not found");
  }

  // Find the user by their ID and select only the college field
  const user = await UserModel.findById(userId).select("college");

  if (!user || !user.college) {
    throw new ApiError(404, "College name not found for this student");
  }

  // Find all students from the same college
  const collageStudents = await UserModel.find({ college: user.college });

  if (!collageStudents || collageStudents.length === 0) {
    throw new ApiError(400, "No students available from the same college");
  }

  return res.status(200).json(
    new ApiResponse(200, { collageStudents }, "All users fetched successfully")
  );
});



//update user details
const updateAccountDetails = asyncHandler(async (req, res) => {
  const { name, email, course, branch_section, year, bio, interests } =
    req.body;
  if (
    !(name && email && course && branch_section && year && bio && interests)
  ) {
    throw new ApiError(400, "Fields Cannot be empty");
  }

  const user = await UserModel.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        nameame,
        email,
        course,
        branch_section,
        year,
        bio,
        interests,
      },
    },
    { new: true } //by this updated user is returned
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(201, {user}, "Account Details Updated Successfully"));
});

//updating profile image
const updateProfileImage = asyncHandler(async (req, res) => {
  const profileImageLocalPath = req.file?.path;
  if (!profileImageLocalPath) {
    throw new ApiError(401, "Avatar is required to update ");
  }
  const profileImage = await uploadOnCloudinary(profileImageLocalPath);
  if (!profileImage.url) {
    throw new ApiError(500, "Error on uploading on avatar");
  }
  const user = await UserModel.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        profileImage: profileImage.secure_url,
      },
    },
    {
      new: true,
    }
  ).select("-password");
  return res
    .status(200)
    .json(new ApiResponse(201, user, "avatar changes successfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  changeCurrentPassword,
  getCurrentUser,
  getAllUser,
  updateAccountDetails,
  updateProfileImage,
  getAllUserOfCollage
};
