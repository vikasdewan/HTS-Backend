import AdminModel from "../../models/campus-connect-models/admin.model.js";
import UserModel from "../../models/campus-connect-models/user.model.js";
import EventModel from "../../models/campus-connect-models/event.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

// Cookie options for secure cookies
const options = {
  httpOnly: true,
  secure: true,
};

// ####################### ADMIN AUTH CONTROLLERS ####################### //

// Register Admin
const  registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, college } = req.body;

  if (!(name && email && password && college)) {
    throw new ApiError(400, "All fields are required");
  }

  const existingAdmin = await AdminModel.findOne({ email });
  if (existingAdmin) {
    throw new ApiError(409, "Admin with this email already exists");
  }

  const admin = await AdminModel.create({ name, email, password, college });
  const newAdmin = await AdminModel.findById(admin._id).select("-password");

  return res
    .status(201)
    .json(new ApiResponse(201, { newAdmin }, "Admin registered successfully"));
});

// Login Admin
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!(email && password)) {
    throw new ApiError(400, "Email and password are required");
  }

  const admin = await AdminModel.findOne({ email });
  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }

  const isPasswordValid = await admin.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const accessToken = admin.genrateAccessToken();
  const loggedInAdmin = await AdminModel.findById(admin._id).select(
    "-password"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        { loggedInAdmin, accessToken },
        "Admin logged in successfully"
      )
    );
});

// Logout Admin
const logoutAdmin = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, "Admin logged out successfully"));
});

// ####################### ADMIN PROFILE CONTROLLERS ####################### //

// Get Admin Profile
const getAdminProfile = asyncHandler(async (req, res) => {
  const admin = await AdminModel.findById(req.admin?._id);
  return res
    .status(200)
    .json(
      new ApiResponse(200, { admin }, "Admin profile fetched successfully")
    );
});

// Update Admin Details
const updateAdminDetails = asyncHandler(async (req, res) => {
  const { name, email, college } = req.body;

  if (!(name && email && college)) {
    throw new ApiError(400, "All fields must be filled");
  }

  const updatedAdmin = await AdminModel.findByIdAndUpdate(
    req.admin?._id,
    { $set: { name, email, college } },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { updatedAdmin },
        "Admin details updated successfully"
      )
    );
});

// Change Admin Password
const changeAdminPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const admin = await AdminModel.findById(req.admin?._id);
  const isPasswordCorrect = await admin.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Old password is incorrect");
  }

  admin.password = newPassword;
  await admin.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

// ####################### ADMIN ACTIONS CONTROLLERS ####################### //

// Get all users who applied to be event organizers
const getEventOrganizerApplications = asyncHandler(async (req, res) => {
  const applications = await UserModel.find({
    isAppliedForEventOrganizer: true,
  }).select("-password");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { applications },
        "Event organizer applications fetched successfully"
      )
    );
});

// Approve an application
const approveApplication = asyncHandler(async (req, res) => {
  const { userId } = req.params; // Get user ID from URL

  const user = await UserModel.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Update user's role to event organizer
  user.isEventOrganizer = true;
  user.isAppliedForEventOrganizer = false; // Reset application status
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "Application approved successfully"));
});

// Reject an application
const rejectApplication = asyncHandler(async (req, res) => {
  const { userId } = req.params; // Get user ID from URL

  const user = await UserModel.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Reset application status without making the user an event organizer
  user.isAppliedForEventOrganizer = false;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "Application rejected successfully"));
});

// Block User
const blockUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await UserModel.findByIdAndUpdate(
    userId,
    { isBlocked: true },
    { new: true }
  );
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "User blocked successfully"));
});

// Unblock User
const unblockUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await UserModel.findByIdAndUpdate(
    userId,
    { isBlocked: false },
    { new: true }
  );
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "User unblocked successfully"));
});

// Get All Users
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await UserModel.find();
  return res
    .status(200)
    .json(new ApiResponse(200, { users }, "All users fetched successfully"));
});

// Get Users By College
const getUsersByCollege = asyncHandler(async (req, res) => {
  const admin = await AdminModel.findById(req.admin._id).select("college");
  const users = await UserModel.find({ college: admin.college });

  if (!users.length) {
    throw new ApiError(404, "No users found from the same college");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { users },
        "Users from the same college fetched successfully"
      )
    );
});

// Delete Event
const deleteEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  const event = await EventModel.findByIdAndDelete(eventId);
  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Event deleted successfully"));
});

// Handle User Reports
// Admin: Get all reported users of the same college
const getReportedUsersByCollege = asyncHandler(async (req, res) => {
  // Get the current admin's college from the request (assuming the admin is authenticated and has the college field)
  const adminCollege = req.admin?.college; 

  if (!adminCollege) {
    throw new ApiError(404, "Admin's college not found");
  }

  // Find reported users that belong to the same college as the admin
  const reportedUsers = await UserModel.find({
    college: adminCollege,
    reportCount: { $gt: 0 }, // Only users who have been reported at least once
  })
    .select("_id username email reportCount isBlocked name college course branch_section") // Select necessary fields
    .lean();

  if (!reportedUsers || reportedUsers.length === 0) {
    throw new ApiError(404, "No reported users found for this college");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { reportedUsers }, "Reported users from the same college fetched successfully"));
});

export {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  getAdminProfile,
  updateAdminDetails,
  changeAdminPassword,
  getEventOrganizerApplications,
  approveApplication,
  rejectApplication,
  blockUser,
  unblockUser,
  getAllUsers,
  getUsersByCollege,
  deleteEvent,
  getReportedUsersByCollege,
};
