import express from "express";
const router = express.Router();
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/isLogin.middleware.js";
//user controller imports
import {
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
} from "../controllers/campus-connect/user.controllers.js";

//Event controllers import
import {
  addEvent,
  deleteEvent,
  getAllEventOfCollage,
  getAllEvents,
  getEventDetails,
  updateEvent,
  getMyEvents
} from "../controllers/campus-connect/event.controllers.js";

//Friend Controllers import
import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendRequests,
  getAllFriends,
} from "../controllers/campus-connect/friends.controllers.js";

//Career related imports
import {
  addOpportunity,
  updateOpportunity,
  deleteOpportunity,
  getOpportunityDetails,
  getAllOpportunities,
  getAllOpportunitiesOfCollege,
  getMyOpportunities
} from "../controllers/campus-connect/opportunities.controllers.js";

//Post Controllers 
import{
  addPost,
  updatePost,
  deletePost,
  getAllPosts,
  likeUnlikePost,
  addComment,
  getUserPosts
} from '../controllers/campus-connect/post.controllers.js'

//Routes for User
router
  .route("/user/register")
  .post(upload.single("profileImage"), registerUser);
router.route("/user/login").post(loginUser);
//secured routes (authentication required)
router.route("/user/logout").get(verifyJWT, logoutUser);
router.route("/user/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/user/current-user").get(verifyJWT, getCurrentUser);
router.route("/user/all").get(verifyJWT, getAllUser);
router.route("/user/college/all").get(verifyJWT, getAllUserOfCollage);
router.route("/user/update-account").patch(verifyJWT, updateAccountDetails);
router.route("/user/eventorganizer/apply").post(verifyJWT, applyForEventOrganizer);
router
  .route("/user/update/profileImage")
  .patch(verifyJWT, upload.single("profileImage"), updateProfileImage);
router.route("/user/report/:reportedUserId").post(verifyJWT,reportUser);

//Event Related Route
router.route("/event/add").post(verifyJWT, upload.single("poster"), addEvent);
router.route("/event/all").get(verifyJWT, getAllEvents);
router.route("/event/college").get(verifyJWT, getAllEventOfCollage);
router.route("/event/my").get(verifyJWT, getMyEvents);
router.route("/event/:id").get(verifyJWT, getEventDetails);
router.route("/event/delete/:id").delete(verifyJWT, deleteEvent);
router.route("/event/update/:id").patch(verifyJWT, updateEvent);

//Friend Related Route
router.route("/friend/send/:id").post(verifyJWT, sendFriendRequest);
router.route("/friend/accept/:id").post(verifyJWT, acceptFriendRequest);
router.route("/friend/reject/:id").post(verifyJWT, rejectFriendRequest);
router.route("/friend/requests").get(verifyJWT, getFriendRequests);
router.route("/friend/all").get(verifyJWT, getAllFriends);

//Opportunities/career related routes
router.route("/career/add").post(verifyJWT, addOpportunity);
router.route("/career/update/:id").patch(verifyJWT, updateOpportunity);
router.route("/career/delete/:id").delete(verifyJWT, deleteOpportunity);
router.route("/career/all").get(verifyJWT, getAllOpportunities);
router.route("/career/college/all").get(verifyJWT, getAllOpportunitiesOfCollege);
router.route("/career/my").get(verifyJWT, getMyOpportunities);
router.route("/career/:id").get(verifyJWT, getOpportunityDetails);

//Post Related Routes
router.route("/post/add").post(verifyJWT, upload.single("postImage"), addPost);
router.route("/post/all").get(verifyJWT, getAllPosts);
router.route("/post/my").get(verifyJWT, getUserPosts);
router.route("/post/like-unlike/:id").post(verifyJWT, likeUnlikePost);
router.route("/post/update/:id").patch(verifyJWT, updatePost);
router.route("/post/delete/:id").delete(verifyJWT, deletePost);
router.route("/post/comment/:id").post(verifyJWT, addComment);
export default router;
