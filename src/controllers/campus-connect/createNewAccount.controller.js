import UserModel from "../../models/campus-connect-models/user.model";
export async function createNewAccount(req, res) {
  const {
    username,
    name,
    email,
    rollnum,
    course,
    branch_section,
    year,
    profileImage,
  } = await req.body;
  const isEmailAlreadyExists = await UserModel.findOne({ email });
  const isUsernameAlreadyExists = await UserModel.findOne({ username });
  if (isEmailAlreadyExists) {
    return res.status(400).json({ message: "Email already exists" });
  }
  if (isUsernameAlreadyExists) {
    return res.status(400).json({ message: "Username already exists" });
  }
  try {
    const newUser = new UserModel({
      username,
      name,
      email,
      rollnum,
      course,
      branch_section,
      year,
      profileImage,
    });
    await newUser.save();
    if (!newUser) {
      return res.status(400).json({ message: "User not created " });
    }

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error occured" });
  }
}
