import User from "../Models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { user_name, email, password, phone_number, profile_color, profile_image } = req.body;

    // Check required fields
    if (!user_name || !email || !password) {
      return res.status(400).json({ error: "Please fill all required fields" });
    }

    // Check for existing user/email/phone
    const userNameExists = await User.findOne({ user_name });
    const emailExists = await User.findOne({ email });
    const phoneExists = phone_number ? await User.findOne({ phone_number }) : null;

    if (userNameExists) return res.status(400).json({ error: "Username already taken" });
    if (emailExists) return res.status(400).json({ error: "Email already exists" });
    if (phoneExists) return res.status(400).json({ error: "Phone number already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      user_name,
      email,
      password: hashedPassword,
      phone_number,
      profile_color: profile_color || "#3bab7e",
      profile_image: profile_image || "",        
    });

    await newUser.save();

    return res.status(201).json({
      message: `Welcome, ${user_name}! Your account has been created.`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, remember } = req.body.formData;

    if (!email || !password) {
      return res.status(400).json({ error: "Please fill all fields" });
    }

    const user = await User.findOne({ email });
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
      secure: "none",
      sameSite: "lax",
      maxAge: remember ? 7 * 24 * 60 * 60 * 1000 : 2 * 60 * 60 * 1000,
      path: "/",
    });

    return res.status(200).json({
      message: `Welcome ${user.user_name}`,
      user: {
        user_name: user.user_name,
        email: user.email,
        profile_color: user.profile_color,
        profile_image: user.profile_image,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: "none",
      sameSite: "lax",
      path: "/",
    });
    res.status(200).json({ message: "Disconnected successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};