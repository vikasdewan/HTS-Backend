const express = require("express");
const router = express.Router();

router.get("/createQuery", createQueryController);
router.get("/queryStatus", queryStatusController);
router.delete("/deleteQuery", deleteQueryController);

module.exports = router;
