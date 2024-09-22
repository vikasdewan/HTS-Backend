import UserModel from "../../models/campus-connect-models/user.model";

export async function userLogin(req, res) {
  const { email, rollnum, username, password } = await req.body;
  try {
    const user = await UserModel.findOne({
      $or: [{ email }, { username }, { rollnum }],
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error occured" });
  }
}
