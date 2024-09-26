import express from "express";
import {
  fetchAllChats,
  accessChat,
  createGroupChat,
  renameGroupChat,
  kickFromGroup,
  addUserToGroup,
} from "../controllers/chat/chat.controller.js";
import { verifyJWT } from "../middlewares/isLogin.middleware.js";

const router = express.Router();

router.get("/", verifyJWT, fetchAllChats);
router.post("/", verifyJWT, accessChat);
router.post("/createDiscussion", verifyJWT, createGroupChat);
router.put("/renameDiscussion", verifyJWT, renameGroupChat);
router.put("/kickfromDiscussion", verifyJWT, kickFromGroup);
router.put("/addtoDiscussion", verifyJWT, addUserToGroup);

export default router;
