import PreorderModel from "../../models/campus-eat-models/preorder.model.js";

export async function placePreOrder(req, res) {
  try {
    const preorder = await PreorderModel.create(req.body);
    return res.status(201).json({ preorder });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error occured" });
  }
}

export async function getAllPreorders(req, res) {
  try {
    const preorders = await PreorderModel.find();
    if (!preorders) {
      return res.status(404).json({ message: "No preorders found" });
    }
    return res.status(200).json({ preorders });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error occured" });
  }
}

export async function updatePreorder(req, res) {
  try {
    const preorder = await PreorderModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!preorder) {
      return res.status(404).json({ message: "Preorder not found" });
    }
    return res.status(200).json({ preorder });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error occured" });
  }
}

export async function deletePreorder(req, res) {
  try {
    const preorder = await PreorderModel.findByIdAndDelete(req.params.id);
    if (!preorder) {
      return res.status(404).json({ message: "Preorder not found" });
    }
    return res.status(200).json({ message: "Preorder deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error occured" });
  }
}

export async function getPreorderById(req, res) {
  try {
    const preorder = await PreorderModel.findById(req.params.id);
    if (!preorder) {
      return res.status(404).json({ message: "Preorder not found" });
    }
    return res.status(200).json({ preorder });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error occured" });
  }
}
