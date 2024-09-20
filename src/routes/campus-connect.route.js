const express = require("express");
const router = express.Router();

router.get("/user", getUserController);
router.get("/notification", getNotificationController);
router.get("/discussion", getDiscussionController);
router.get("/event", getEventController);
router.get("/friend", getFriendController);
router.get("/message", getMessageController);

module.exports = router;
