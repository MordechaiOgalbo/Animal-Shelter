import User from "../Models/User.js";
import bcrypt from "bcryptjs";
export const register = async (req, res) => {
  try {
    const { user_name, email, password, phone_number } = req.body;
    if (!user_name || !email || !password) {
      return res.status(400).json({ error: "fill all the required fields" });
    }

    const user_nameExsistance = await User.findOne({ user_name });
    const email_Exsistance = await User.findOne({ email });
    const phone_numberExsistance = await User.findOne({ phone_number });

    if (user_nameExsistance) {
      return res.status(400).json({ error: "user name already taken" });
    }
    if (email_Exsistance) {
      return res.status(400).json({ error: "email already exsists" });
    }
    if (phone_numberExsistance) {
      return res.status(400).json({ error: "phone number already exsists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      user_name,
      email,
      password: hashedPassword,
      phone_number,
    });
    await newUser.save();

    return res.status(201).json({
      message: `Welcome, ${user_name}! Your account has been created.`,
    });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};
