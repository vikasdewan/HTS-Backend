import { Router } from "express";
const router = Router();

router.get("/product", getProductController);
router.get("/payment", getPaymentController);
router.get("/message", getMessageController);
router.get("/favourite", getFavouriteController);

module.exports = router;
