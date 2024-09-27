import ProductsModel from "../../models/campus-store-models/products.model.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export async function getAllProducts(req, res) {
  try {
    const products = await ProductsModel.find();
    if (!products) {
      return res.status(404).json({ message: "No products found" });
    }
    return res.status(200).json({ products });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error occured" });
  }
}
const addNewProduct = asyncHandler(async (req, res) => {
  const { name,description,price,category } = req.body;
  const userId = req.user._id;

  if (!(name && description && price && category ) ){
    throw new ApiError(400, "Content is required");
  }

  const user = await UserModel.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const productImageLocalPath = req.file?.path;
  let productImage;
  if (productImageLocalPath) {
    productImage = await uploadOnCloudinary(productImageLocalPath);
  }

  const product = await PostModel.create({
    name,
    description,
    price,
    category,
    postedBy: userId,
    college: user.college,
    productImage: productImage?.secure_url || "",
  });

  if (!product) {
    throw new ApiError(400, "Error while creating post");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, { product }, "Post added successfully"));
});



export async function getProductById(req, res) {
  try {
    const product = await ProductsModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json({ product });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error occured" });
  }
}

export async function updateProductById(req, res) {
  try {
    const product = await ProductsModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json({ product });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error occured" });
  }
}

export async function deleteProductById(req, res) {
  try {
    const product = await ProductsModel.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error occured" });
  }
}


export {
  addNewProduct,
};