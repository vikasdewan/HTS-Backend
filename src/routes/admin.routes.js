import express from "express";
import { verifyJWT } from "../middlewares/isLogin.middleware.js"; // JWT verification middleware
import {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  getAdminProfile,
  updateAdminDetails,
  changeAdminPassword,
  validateEventOrganizer,
  verifyUser,
  blockUser,
  unblockUser,
  getAllUsers,
  getUsersByCollege,
  deleteEvent,
  handleUserReports,
} from "../controllers/campus-connect/admin.controller.js";

const router = express.Router();

// Auth routes
router.route("/register").post(registerAdmin);
router.route("/login").post(loginAdmin);
router.route("/logout").get(verifyJWT, logoutAdmin);

// Profile management routes
router.route("/profile").get(verifyJWT, getAdminProfile);
router.route("/profile/update").patch(verifyJWT, updateAdminDetails);
router.route("/profile/change-password").patch(verifyJWT, changeAdminPassword);

// Admin actions
router.route("/event-organizer/validate/:userId").post(verifyJWT, validateEventOrganizer);
router.route("/user/verify/:userId").post(verifyJWT, verifyUser);
router.route("/user/block/:userId").post(verifyJWT, blockUser);
router.route("/user/unblock/:userId").post(verifyJWT, unblockUser);
router.route("/users").get(verifyJWT, getAllUsers);
router.route("/users/college").get(verifyJWT, getUsersByCollege);
router.route("/event/delete/:eventId").delete(verifyJWT, deleteEvent);
router.route("/user/reports/:userId").post(verifyJWT, handleUserReports);

export default router;
