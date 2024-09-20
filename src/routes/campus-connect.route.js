const express = require("express");

const router = express.Router();

router.get("/user", getUserInformation);
router.post("/user", createUser);
router.get("/notification", getAllNotification);
router.get("/discussion", getDiscussionController);
router.get("/event", getEventController);
router.get("/friend", getFriendController);
router.get("/message", getMessageController);

module.exports = router;
