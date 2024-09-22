import ProductsModel from "../../models/campus-store-models/products.model.js";
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

export async function addNewProduct(req, res) {
  try {
    const product = new ProductsModel(req.body);
    await product.save();
    if (!product) {
      return res.status(400).json({ message: "Failed to add product" });
    }
    return res.status(201).json({ product });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error occured" });
  }
}

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
