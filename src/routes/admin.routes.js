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
    handleUserReports,
} from "../controllers/campus-connect/admin.controller.js";

const router = express.Router();

// Auth routes
router.route("/register").post(registerAdmin);
router.route("/login").post(loginAdmin);
router.route("/logout").get(verifyJWT("admin"), logoutAdmin); // Verify admin token for logout

// Profile management routes
router.route("/profile").get(verifyJWT("admin"), getAdminProfile);
router.route("/profile/update").patch(verifyJWT("admin"), updateAdminDetails);
router.route("/profile/change-password").patch(verifyJWT("admin"), changeAdminPassword);

// Admin actions
router.route("/user/block/:userId").post(verifyJWT("admin"), blockUser);
router.route("/user/unblock/:userId").post(verifyJWT("admin"), unblockUser);
router.route("/users").get(verifyJWT("admin"), getAllUsers);
router.route("/users/college").get(verifyJWT("admin"), getUsersByCollege);
router.route("/event/delete/:eventId").delete(verifyJWT("admin"), deleteEvent);
router.route("/user/reports/:userId").post(verifyJWT("admin"), handleUserReports);

// Event organizer application routes
router.route("/event-organizer/applications").get(verifyJWT("admin"), getEventOrganizerApplications);
router.route("/event-organizer/approve/:userId").post(verifyJWT("admin"), approveApplication);
router.route("/event-organizer/reject/:userId").post(verifyJWT("admin"), rejectApplication);

export default router;
