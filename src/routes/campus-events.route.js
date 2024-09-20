const express = require("express");
const router = express.Router();

router.get("/getAllEvent", getEventController);
router.post("/createEvent", createEventController);
router.put("/updateEvent", updateEventController);
router.delete("/deleteEvent", deleteEventController);

module.exports = router;
