const express = require("express");
const router = express.Router();

router.get("/question", getQuestionController);
router.get("/answer", getAnswerController);
router.get("/vote", getVoteController);

module.exports = router;
