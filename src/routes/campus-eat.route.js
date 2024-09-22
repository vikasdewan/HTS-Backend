import express from "express";
const router = express.Router();
import { placePreOrder } from "../controllers/campus-eat/preorder.controller.js";
import {
  getAllMenus,
  reviewMenu,
} from "../controllers/campus-eat/menu.controller.js";
router.get("/menu", getAllMenus);

router.get("/preorder", placePreOrder);
router.get("/review", reviewMenu);

export default router;
