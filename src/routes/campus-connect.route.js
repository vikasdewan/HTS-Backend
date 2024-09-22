import express from "express";
const router = express.Router();
import { upload } from "../middlewares/multer.middleware.js";
import {verifyJWT} from '../middlewares/isLogin.middleware.js'
import {
  registerUser,
  loginUser,
  logoutUser,
  changeCurrentPassword,
  getCurrentUser,
  getAllUser,
  updateAccountDetails,
  updateProfileImage,
} from "../controllers/campus-connect/user.controllers.js";

import {
addEvent,
updateEvent
} from '../controllers/campus-connect/event.controllers.js'
//Routes for User 
router
  .route("/user/register")
  .post(upload.single("profileImage"), registerUser);
router.route("/user/login").post(loginUser);
//secured routes (authentication required)
router.route("/user/logout").get(verifyJWT,logoutUser);
router.route("/user/change-password").post(verifyJWT,changeCurrentPassword);
router.route("/user/current-user").get(verifyJWT,getCurrentUser);
router.route("/user/all").get(verifyJWT,getAllUser);
router.route("/user/update-account").patch(verifyJWT,updateAccountDetails);
router.route("/user/update/profileImage").patch(verifyJWT,upload.single("profileImage"),updateProfileImage);


//Event Related Route
router.route("/event/add").post(verifyJWT,addEvent);
router.route("/event/update/:id").patch(verifyJWT,updateEvent);
export default router;
