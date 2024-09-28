import ProductsModel from "../../models/campus-store-models/products.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import UserModel from "../../models/campus-connect-models/user.model.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";

// Adding a New Product
const addNewProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category,phone } = req.body;
  
  if (!(name && description && price && category&&phone)) {
    throw new ApiError(400, "All fields are mandatory");
  }

  const userId = req.user._id;
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const productImageLocalPath = req.file?.path;
  let productImage;
  if (productImageLocalPath) {
    productImage = await uploadOnCloudinary(productImageLocalPath);
  }

  const product = await ProductsModel.create({
    name,
    description,
    price,
    phone,
    category,
    sellerId: userId,
    image: productImage ? productImage.secure_url : "",
    sold: false,
    college:user?.college
  });

  if (!product) {
    throw new ApiError(400, "Error while creating product");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, { product }, "Product added successfully"));
});

// Updating an Existing Product
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const product = await ProductsModel.findById(id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (product.sellerId.toString() !== userId.toString()) {
    throw new ApiError(403, "Unauthorized to update this product");
  }

  const updatedProduct = await ProductsModel.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { updatedProduct }, "Product updated successfully"));
});

// Deleting a Product
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const product = await ProductsModel.findById(id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (product.sellerId.toString() !== userId.toString()) {
    throw new ApiError(403, "Unauthorized to delete this product");
  }

  const deletedProduct = await ProductsModel.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, { deletedProduct }, "Product deleted successfully"));
});

// Get Details of a Single Product
const getProductDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await ProductsModel.findById(id).populate("sellerId", "name email");
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { product }, "Product fetched successfully"));
});

// Get All Products
const getAllProducts = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const products = await ProductsModel.find({college:user.college});
  if (!products || products.length === 0) {
    throw new ApiError(404, "No products available");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { products }, "All products fetched successfully"));
});

// Get All Products of a Seller
const getMyProducts = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const products = await ProductsModel.find({ sellerId: userId });
  if (!products || products.length === 0) {
    throw new ApiError(404, "No products available for this seller");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { products }, "All products of the seller fetched successfully"));
});

export {
  addNewProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  getAllProducts,
  getMyProducts,
};
