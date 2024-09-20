const express = require("express");
const router = express.Router();

// app.use("/api/v1/campus-eat/menu", menuRouter);
// app.use("/api/v1/campus-eat/preorder", preorderRouter);
// app.use("/api/v1/campus-eat/review", reviewRouter);

router.get("/menu", getMenuController);
router.get("/preorder", getPreorderController);
router.get("/review", getReviewController);

module.exports = router;
