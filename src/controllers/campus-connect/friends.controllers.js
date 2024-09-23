import UserModel from "../../models/campus-connect-models/user.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

// Send Friend Request
const sendFriendRequest = asyncHandler(async (req, res) => {
  const {id:targetedUserId} = req.params;
  if(!targetedUserId) {
    throw new ApiError(404,"Id is Not Present ");
  }
  const currentUserId = req.user?._id;
  const targetedUser = await UserModel.findById(targetedUserId);
  if(!targetedUser){
    throw new ApiError(404,"User Not Found with provided id");
  }
  if(targetedUser.friendRequests.includes(currentUserId) || targetedUser.friends.includes(currentUserId)){
    throw new ApiError()
  }

});

// Accept Friend Request
const acceptFriendRequest = asyncHandler(async (req, res) => {
  const { id: senderUserId } = req.params; // Sender's user ID
  const userId = req.user._id; // Logged-in user (receiver)

  const currentUser = await UserModel.findById(userId);
  const senderUser = await UserModel.findById(senderUserId);

  if (!senderUser) {
    throw new ApiError(404, "Sender user not found");
  }

  // Check if the friend request exists
  if (!currentUser.friendRequests.includes(senderUserId)) {
    throw new ApiError(400, "No friend request found from this user");
  }

  // Add each other as friends
  currentUser.friends.push(senderUserId);
  senderUser.friends.push(userId);

  // Remove the friend request
  currentUser.friendRequests = currentUser.friendRequests.filter(
    (id) => id.toString() !== senderUserId.toString()
  );

  await currentUser.save();
  await senderUser.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Friend request accepted successfully"));
});

// Reject Friend Request
const rejectFriendRequest = asyncHandler(async (req, res) => {
  const { id: senderUserId } = req.params; // Sender's user ID
  const userId = req.user._id; // Logged-in user (receiver)

  const currentUser = await UserModel.findById(userId);

  if (!currentUser) {
    throw new ApiError(404, "User not found");
  }

  // Check if the friend request exists
  if (!currentUser.friendRequests.includes(senderUserId)) {
    throw new ApiError(400, "No friend request found from this user");
  }

  // Remove the friend request
  currentUser.friendRequests = currentUser.friendRequests.filter(
    (id) => id.toString() !== senderUserId.toString()
  );

  await currentUser.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Friend request rejected successfully"));
});

// Get All Friend Requests for Logged-in User
const getFriendRequests = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Logged-in user
  const currentUser = await UserModel.findById(userId).populate("friendRequests", "name email");

  if (!currentUser) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { friendRequests: currentUser.friendRequests }, "Friend requests fetched successfully"));
});

// Get All Friends for Logged-in User
const getAllFriends = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Logged-in user ID

  const currentUser = await UserModel.findById(userId).populate("friends", "name email profileImage");

  if (!currentUser) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { friends: currentUser.friends }, "Friends list fetched successfully"));
});

export {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendRequests,
  getAllFriends,
};
