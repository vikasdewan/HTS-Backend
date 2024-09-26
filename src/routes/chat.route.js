import express from "express";
const router = express.Router();
import { verifyJWT } from "../middlewares/isLogin.middleware.js";

router.get("/", verifyJWT, fetchAllChats);
router.post("/", verifyJWT, accessChat);
router.post("/createDiscussion", verifyJWT, createGroupChat);
router.put("/renameDiscussion", verifyJWT, renameGroupChat);
router.put("/kickfromDiscussion", verifyJWT, kickFromGroup);
router.put("/addtoDiscussion", verifyJWT, addUserToGroup);

export default router;
