import UserModel from "../../models/campus-connect-models/user.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";

const genratingAccessToken = async (userId) => {
  try {
    const user = await UserModel.findById(userId);
    const accessToken = user.genrateAccessToken();
    await user.save({ validateBeforeSave: false });

    return { accessToken };
  } catch (error) {
    throw new ApiError(500, "Error while genrating access  token");
  }
};

const options = {
  expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
  httpOnly:true,
  secure:true,
  sameSite:'None'
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
    college,
    course,
    branch_section,
    year
  } = req.body;
  //check for data availability
  if (
    !(
      username &&
      name &&
      email &&
      rollnum &&
      college &&
      course &&
      branch_section &&
      year &&
      password&&college
    )
  ) {
    throw new ApiError(404, "All Fields are required for registration");
  }
  //check for existing user
  const existedUser = await UserModel.findOne({
    $or: [{ username }, { email }, { rollnum }],
  });
  if (existedUser) {
    throw new ApiError(409, "Username or Email or Roll Number Already Exist");
  }

  const profileImageLocalPath = req.file?.path;
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
      college,
      course,
      branch_section,
      year,
      password,
      college,
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
  const { email, username, password, rollnum } = await req.body;

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
  const { oldPassword, newPassword } = await req.body;
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
  const userId = req.user?._id;
  const user = await UserModel.findByIdAndUpdate(
     userId,
    {
      $set: {
        name,
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

// User applies to be an event organizer
const applyForEventOrganizer = asyncHandler(async (req, res) => {
  const userId = req.user?._id; // Get the current user's ID

  // Check if the user has already applied
  const user = await UserModel.findById(userId);
  if (user.isAppliedForEventOrganizer) {
    throw new ApiError(400, "You have already applied to be an event organizer.");
  }

  // Update the user's isAppliedForEventOrganizer status to true
  user.isAppliedForEventOrganizer = true;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(
    new ApiResponse(200, { user }, "Application to be an event organizer submitted successfully")
  );
});

// User reports another user
const reportUser = asyncHandler(async (req, res) => {
  const { reportedUserId } = req.params; // The ID of the user being reported
  const userId = req.user?._id; // The ID of the user reporting

  // Check if both user IDs are valid
  if (!reportedUserId || !userId) {
    throw new ApiError(400, "Invalid user ID or reported user ID");
  }

  // Find the reported user
  const reportedUser = await UserModel.findById(reportedUserId);
  if (!reportedUser) {
    throw new ApiError(404, "Reported user not found");
  }

  // Check if the user is trying to report themselves
  if (reportedUserId === userId.toString()) {
    throw new ApiError(400, "You cannot report yourself");
  }

  // Increment the report count of the reported user
  reportedUser.reportCount += 1;

  // Block the user if the report count exceeds the threshold
  const reportThreshold = 10; // Example threshold for automatic blocking
  if (reportedUser.reportCount >= reportThreshold) {
    reportedUser.isBlocked = true;
  }

  // Save the updated reported user details
  await reportedUser.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          reportedUser: {
            _id: reportedUser._id,
            reportCount: reportedUser.reportCount,
            isBlocked: reportedUser.isBlocked,
          },
        },
        "User reported successfully"
      )
    );
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
  getAllUserOfCollage,
  applyForEventOrganizer,
  reportUser
};
