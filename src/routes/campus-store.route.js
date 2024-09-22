import {
  getAllProducts,
  deleteProductById,
  updateProductById,
  getProductById,
  addNewProduct,
} from "../controllers/campus-store/product.controller";

import { Router } from "express";
const router = Router();

router.get("/product", getAllProducts);
router.post("/product", addNewProduct);
router.get("/product/:id", getProductById);
router.put("/product/:id", updateProductById);
router.delete("/product/:id", deleteProductById);

module.exports = router;
