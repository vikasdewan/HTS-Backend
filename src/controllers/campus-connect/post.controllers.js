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
  const {content} = req.body;
  if(!content){
    throw new ApiError(404,"Content is required to update")
  }
  const updatedPost = await PostModel.findByIdAndUpdate(id, {content}, {
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

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Fetch all posts from the user's college
  const posts = await PostModel.find({ college: user.college })
    .populate("postedBy", "name profileImage")
    .populate("comments.commentedBy", "name profileImage");

  if (!posts || posts.length === 0) {
    new ApiResponse(404,null,"No posts available for your college");
  }
  const formattedPosts = posts.map((post) => ({
    _id: post._id,
    content: post.content,
    postedBy: {
      name: post.postedBy.name,
      profileImage: post.postedBy.profileImage,
    },
    college: post.college,
    postImage: post.postImage,
    likeCount: post.likeCount, // Number of likes
    comments: post.comments.map((comment) => ({
      commentText: comment.commentText,
      commentedBy: {
        name: comment.commentedBy.name,
        profileImage: comment.commentedBy.profileImage,
      },
      commentedAt: comment.commentedAt,
    })),
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  }));

  return res
    .status(200)
    .json(new ApiResponse(200, { posts: formattedPosts }, "Posts fetched successfully"));
});

// Like/Unlike a Post
const likeUnlikePost = asyncHandler(async (req, res) => {
  const { id } = req.params;  // Post ID
  const userId = req.user._id; // User ID from request

  // Find the post by ID
  const post = await PostModel.findById(id);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const isLiked = post.likes.includes(userId); // Check if the user has already liked the post

  if (isLiked) {
    post.likes.pull(userId); // Unlike the post by removing the user's ID
    post.likeCount -= 1;     // Decrease likeCount by 1
  } else {
    post.likes.push(userId);  // Like the post by adding the user's ID
    post.likeCount += 1;      // Increase likeCount by 1
  }

  await post.save(); // Save the changes to the database

  // Send response
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

//get user post 
// Get Posts of a Specific User
const getUserPosts = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Fetch all posts from the user's college
  const posts = await PostModel.find({ postedBy: userId })
    .populate("postedBy", "name profileImage")
    .populate("comments.commentedBy", "name profileImage");

  if (!posts || posts.length === 0) {
    new ApiResponse(404,null,"Not Posted Anything Yet");
  }
  const formattedPosts = posts.map((post) => ({
    _id: post._id,
    content: post.content,
    postedBy: {
      name: post.postedBy.name,
      profileImage: post.postedBy.profileImage,
    },
    college: post.college,
    postImage: post.postImage,
    likeCount: post.likeCount, // Number of likes
    comments: post.comments.map((comment) => ({
      commentText: comment.commentText,
      commentedBy: {
        name: comment.commentedBy.name,
        profileImage: comment.commentedBy.profileImage,
      },
      commentedAt: comment.commentedAt,
    })),
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  }));

  return res
    .status(200)
    .json(new ApiResponse(200, { posts: formattedPosts }, "Posts fetched successfully"));
});


export {
  addPost,
  updatePost,
  deletePost,
  getAllPosts,
  likeUnlikePost,
  addComment,
  getUserPosts
};
