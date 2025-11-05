import User from "../Models/User.js";

export const allUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};
