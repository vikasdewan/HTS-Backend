import MenuModel from "../../models/campus-eat-models/menu.model.js";

export async function getAllMenus(req, res) {
  try {
    const menus = await MenuModel.find();
    if (!menus) {
      return res.status(404).json({ message: "No menus found" });
    }
    return res.status(200).json({ menus });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error occured" });
  }
}

export async function reviewMenu(req, res) {
  try {
    const menu = await MenuModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!menu) {
      return res.status(404).json({ message: "Menu not found" });
    }
    return res.status(200).json({ menu });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error occured" });
  }
}
