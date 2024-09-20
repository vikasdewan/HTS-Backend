const express = require("express");
const router = express.Router();

router.get("/users", getUserController);
router.get("/notification", getNotificationController);
router.get("/discussion", getDiscussionController);
router.get("/event", getEventController);
router.get("/friend", getFriendController);
router.get("/message", getMessageController);

export default router;
