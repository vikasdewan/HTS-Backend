import express from "express";
import { verifyJWT } from "../middlewares/isLogin.middleware.js"; // Middleware for authentication
import { upload } from "../middlewares/multer.middleware.js"; // Middleware for handling image uploads
import {
  addNewProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  getAllProducts,
  getMyProducts,
} from "../controllers/campus-store/product.controller.js";

const router = express.Router();

// ---------------------- Product Routes ---------------------- //

// Add New Product (Authenticated & with Image Upload)
// Make sure this is defined before the dynamic route like /products/:id
router.route("/products/add").post( 
  verifyJWT,
  upload.single("image"), // Handle image upload
  addNewProduct
);

// Get All Products
router.get("/products",verifyJWT, getAllProducts);

// Get All Products by Logged-in User (Authenticated)
router.get("/products/my", verifyJWT, getMyProducts);
// Get Product Details by ID
router.get("/products/:id",verifyJWT, getProductDetails);

// Update Product by ID (Authenticated)
router.patch(
  "/products/update/:id",
  verifyJWT,
  upload.single("image"), // Optionally handle updated image upload
  updateProduct
);

// Delete Product by ID (Authenticated)
router.delete("/products/delete/:id", verifyJWT, deleteProduct);


export default router;
