import User from "../Models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
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
export const login = async (req, res) => {
  const { email, password, remember } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "fill all the fields" });
  }
  const user = User.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: "Invalid email or password" });
  }
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).json({ error: "Invalid email or password" });
  }
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: remember ? "7d" : "2h" }
  );
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.COOKIE_SAMESITE === "none",
    sameSite: process.env.COOKIE_SAMESITE || "lax",
    maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 2 * 60 * 60 * 1000,
    path: "/",
  });
  res.status(200).json({
      message: `Welcome ${user_name}`
      },
    );
};
