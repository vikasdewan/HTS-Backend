const express = require("express");

const router = express.Router();

router.get("/user", getUserInformation);
router.post("/user", createUser);
router.put("/user", updateUser);
router.delete("/user", deleteUser);

router.get("/notification", getAllNotification);
router.get("/discussion", getDiscussionController);

router.get("/event", getEventController);
router.get("/friend", getFriendController);
router.delete("/friend:id", deleteFriendController);

router.get("/message", getMessageController);
router.post("/message", postMessageController);
router.delete("/message:id", deleteMessageController);

module.exports = router;
