import express from "express";
import { verifyJWT } from "../middlewares/isLogin.middleware.js"; // JWT verification middleware
import {
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
} from "../controllers/campus-connect/admin.controller.js";

const router = express.Router();

// Auth routes
router.route("/register").post(registerAdmin);
router.route("/login").post(loginAdmin);
router.route("/logout").get(verifyJWT, logoutAdmin); // Verify admin token for logout

// Profile management routes
router.route("/profile").get(verifyJWT, getAdminProfile);
router.route("/profile/update").patch(verifyJWT, updateAdminDetails);
router.route("/profile/change-password").patch(verifyJWT, changeAdminPassword);

// Admin actions
router.route("/user/block/:userId").post(verifyJWT, blockUser);
router.route("/user/unblock/:userId").post(verifyJWT, unblockUser);
router.route("/users").get(verifyJWT, getAllUsers);
router.route("/users/college").get(verifyJWT, getUsersByCollege);
router.route("/event/delete/:eventId").delete(verifyJWT, deleteEvent);
router.route("/reported-users/college").get(verifyJWT, getReportedUsersByCollege);

// Event organizer application routes
router.route("/event-organizer/applications").get(verifyJWT, getEventOrganizerApplications);
router.route("/event-organizer/approve/:userId").post(verifyJWT, approveApplication);
router.route("/event-organizer/reject/:userId").post(verifyJWT, rejectApplication);

export default router;
