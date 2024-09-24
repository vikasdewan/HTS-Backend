import PostModel from "../../models/campus-connect-models/post.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";
import UserModel from "../../models/campus-connect-models/user.model.js";

// Add a new Post
const addPost = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const userId = req.user._id;

  if (!content) {
    throw new ApiError(400, "Content is required");
  }

  const user = await UserModel.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const postImageLocalPath = req.file?.path;
  let postImage;
  if (postImageLocalPath) {
    postImage = await uploadOnCloudinary(postImageLocalPath);
  }

  const post = await PostModel.create({
    content,
    postedBy: userId,
    college: user.college,
    postImage: postImage?.secure_url || "",
  });

  if (!post) {
    throw new ApiError(400, "Error while creating post");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, { post }, "Post added successfully"));
});

// Update a Post
const updatePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const post = await PostModel.findById(id);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  if (post.postedBy.toString() !== userId.toString()) {
    throw new ApiError(403, "Unauthorized to update this post");
  }

  const updatedPost = await PostModel.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { updatedPost }, "Post updated successfully"));
});

// Delete a Post
const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const post = await PostModel.findById(id);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  if (post.postedBy.toString() !== userId.toString()) {
    throw new ApiError(403, "Unauthorized to delete this post");
  }

  const deletedPost = await PostModel.findByIdAndDelete(id);
  return res
    .status(200)
    .json(new ApiResponse(200, { deletedPost }, "Post deleted successfully"));
});

// Get All Posts of the Same College
const getAllPosts = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await UserModel.findById(userId);

  const posts = await PostModel.find({ college: user.college })
    .populate("postedBy", "name profileImage")
    .populate("comments.commentedBy", "name");

  if (!posts || posts.length === 0) {
    throw new ApiError(404, "No posts available for your college");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { posts }, "Posts fetched successfully"));
});

// Like/Unlike a Post
const likeUnlikePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const post = await PostModel.findById(id);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const isLiked = post.likes.includes(userId);
  if (isLiked) {
    post.likes.pull(userId); // Unlike
  } else {
    post.likes.push(userId); // Like
  }

  await post.save();
  return res
    .status(200)
    .json(
      new ApiResponse(200, { post }, isLiked ? "Post unliked" : "Post liked")
    );
});

// Add a Comment to a Post
const addComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { commentText } = req.body;
  const userId = req.user._id;

  if (!commentText) {
    throw new ApiError(400, "Comment text is required");
  }

  const post = await PostModel.findById(id);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  post.comments.push({
    commentText,
    commentedBy: userId,
    commentedAt: new Date(),
  });

  await post.save();
  return res
    .status(200)
    .json(new ApiResponse(200, { post }, "Comment added successfully"));
});

export {
  addPost,
  updatePost,
  deletePost,
  getAllPosts,
  likeUnlikePost,
  addComment,
};
