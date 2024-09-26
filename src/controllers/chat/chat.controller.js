import ChatModel from "../../models/chats.model/chat.model.js";
import UserModel from "../../models/campus-connect-models/user.model.js";

export async function accessChat(req, res) {
  const { user_id } = await req.body;
  if (!user_id) return res.status(400).json({ message: "User ID is required" });
  try {
    let isChat = await ChatModel.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: user_id } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    isChat = await UserModel.populate(isChat, {
      path: "latestMessage.sender",
      select: "name email username  -password",
    });

    if (isChat.length > 0) {
      res.status(200).json(isChat[0]);
    } else {
      const chatData = {
        chatName: "Sender",
        users: [req.user._id, user_id],
        isGroupChat: false,
      };

      try {
        const createdChat = await ChatModel.create(chatData);
        const fullChat = await ChatModel.findOne({
          _id: createdChat._id,
        }).populate("users", "-password");
        res.status(200).json(fullChat);
      } catch (error) {
        res.status(404).json({
          message: error.message,
        });
      }
    }
  } catch (error) {
    console.error("Error in accessChat outer catch:", error); // Log full error details
    res.status(404).json({
      message: error.message,
    });
  }
}

export async function fetchAllChats(req, res) {
  try {
    let result = await ChatModel.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    result = await UserModel.populate(result, {
      path: "latestMessage.sender",
      select: "name  username  ",
    });

    await res.status(200).json(result);
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
}

export async function createGroupChat(req, res) {
  const { users, chatName } = req.body;
  if (!users || !chatName)
    return res
      .status(400)
      .json({ message: "Users and Chat Name are required" });

  try {
    if (users.length < 2)
      return res.status(400).json({ message: "Please add more than one user" });
    await users.push(req.user._id);
    const groupChat = await ChatModel.create({
      chatName,
      users,
      isGroupChat: true,
      groupAdmin: req.user._id,
    });

    const fullChat = await ChatModel.findOne({
      _id: groupChat._id,
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).json(fullChat);
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
}

export async function renameGroupChat(req, res) {
  const { chatId, chatName } = await req.body;
  if (!chatId || !chatName)
    return res
      .status(400)
      .json({ message: "Chat ID and Chat Name are required" });

  try {
    const updatedChat = await ChatModel.findByIdAndUpdate(
      chatId,
      { chatName },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!updatedChat)
      return res.status(400).json({ message: "Chat not found" });

    res.status(200).json(updatedChat);
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
}

export async function addUserToGroup(req, res) {
  console.log("Add user to group hit");
  const { chatId, userId } = await req.body;
  if (!chatId || !userId)
    return res
      .status(400)
      .json({ message: "Chat ID and User ID are required" });

  try {
    const chat = await ChatModel.findById(chatId);
    if (!chat) return res.status(400).json({ message: "Chat not found" });

    if (chat.groupAdmin.toString() !== req.user._id.toString())
      return res.status(400).json({ message: "You are not the admin" });

    if (chat.users.includes(userId))
      return res.status(400).json({ message: "User already in group" });

    await chat.users.push(userId);
    await chat.save();
    const updatedChat = await ChatModel.findOne({
      _id: chatId,
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).json(updatedChat);
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
}

export async function kickFromGroup(req, res) {
  const { chatId, userId } = await req.body;
  if (!chatId || !userId)
    return res
      .status(400)
      .json({ message: "Chat ID and User ID are required" });

  try {
    const chat = await ChatModel.findById(chatId);
    if (!chat) return res.status(400).json({ message: "Chat not found" });

    if (chat.groupAdmin.toString() !== req.user._id.toString())
      return res.status(400).json({ message: "You are not the admin" });

    if (!chat.users.includes(userId))
      return res.status(400).json({ message: "User not in group" });

    await chat.users.pull(userId);
    await chat.save();
    const updatedChat = await ChatModel.findOne({
      _id: chatId,
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).json(updatedChat);
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
}
