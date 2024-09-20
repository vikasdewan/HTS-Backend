const express = require("express");
const router = express.Router();

router.get("/menu", getMenuController);
router.get("/preorder", getPreorderController);
router.get("/review", getReviewController);

module.exports = router;
