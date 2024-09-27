import {
  getAllProducts,
  deleteProductById,
  updateProductById,
  getProductById,
  addNewProduct,
} from "../controllers/campus-store/product.controller.js";
import express from "express";
const router = express.Router();

router.get("/product", getAllProducts);
router.post("/product/add", addNewProduct);
router.get("/product/:id", getProductById);
router.put("/product/:id", updateProductById);
router.delete("/product/:id", deleteProductById);

export default router;
