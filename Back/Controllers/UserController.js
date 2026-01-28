import User from "../Models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.cookies?.token;
  
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

export const allUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

// Get current user profile
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password -reset_token -reset_token_expiry");
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Update user profile
export const updateUser = async (req, res) => {
  try {
    const {
      user_name,
      email,
      phone_number,
      age,
      profile_color,
      profile_text_color,
      profile_image,
      bio,
      address
    } = req.body;

    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if email or username is being changed and if it's already taken
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email, _id: { $ne: req.userId } });
      if (emailExists) {
        return res.status(400).json({ error: "Email already exists" });
      }
    }

    if (user_name && user_name !== user.user_name) {
      const usernameExists = await User.findOne({ user_name, _id: { $ne: req.userId } });
      if (usernameExists) {
        return res.status(400).json({ error: "Username already taken" });
      }
    }

    // Update fields
    if (user_name) user.user_name = user_name;
    if (email) user.email = email;
    if (phone_number !== undefined) user.phone_number = phone_number || undefined;
    if (age !== undefined) user.age = age || undefined;
    if (profile_color) user.profile_color = profile_color;
    if (profile_text_color) user.profile_text_color = profile_text_color;
    if (profile_image !== undefined) user.profile_image = profile_image || "";
    if (bio !== undefined) user.bio = bio || "";
    if (address) {
      user.address = {
        street: address.street || user.address?.street || "",
        city: address.city || user.address?.city || "",
        state: address.state || user.address?.state || "",
        zip_code: address.zip_code || user.address?.zip_code || "",
        country: address.country || user.address?.country || "",
      };
    }

    await user.save();

    // Return updated user without sensitive data
    const updatedUser = await User.findById(req.userId).select("-password -reset_token -reset_token_expiry");
    res.json({
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error("Error updating user:", error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ error: `${field} already exists` });
    }
    res.status(500).json({ error: "Server Error" });
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Please provide both current and new password" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters long" });
    }

    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify current password
    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Delete user account
export const deleteUser = async (req, res) => {
  try {
    // Try to get username from body first, then from query
    const username = req.body?.username || req.query?.username;

    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Only allow users with role "user" to delete their account
    if (user.role !== "user") {
      return res.status(403).json({ error: "Only regular users can delete their accounts" });
    }

    // Verify username matches (case-sensitive)
    if (!username || username !== user.user_name) {
      return res.status(400).json({ error: "Username does not match" });
    }

    // Delete the user
    await User.findByIdAndDelete(req.userId);

    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Add animal to favorites
export const addToFavorites = async (req, res) => {
  try {
    const { animalId } = req.body;

    if (!animalId) {
      return res.status(400).json({ error: "Animal ID is required" });
    }

    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if already in favorites
    if (user.favorites.includes(animalId)) {
      return res.status(400).json({ error: "Animal already in favorites" });
    }

    // Add to favorites
    user.favorites.push(animalId);
    await user.save();

    res.json({ message: "Animal added to favorites", favorites: user.favorites });
  } catch (error) {
    console.error("Error adding to favorites:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Remove animal from favorites
export const removeFromFavorites = async (req, res) => {
  try {
    const { animalId } = req.body;

    if (!animalId) {
      return res.status(400).json({ error: "Animal ID is required" });
    }

    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Remove from favorites
    user.favorites = user.favorites.filter(
      (favId) => favId.toString() !== animalId.toString()
    );
    await user.save();

    res.json({ message: "Animal removed from favorites", favorites: user.favorites });
  } catch (error) {
    console.error("Error removing from favorites:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Get user favorites with animal details
export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get the favorite IDs before populating
    const favoriteIds = user.favorites || [];
    
    // Populate favorites
    await user.populate("favorites");
    
    // Map favorites, preserving IDs for removed animals
    const favorites = favoriteIds.map((id, index) => {
      const populatedAnimal = user.favorites[index];
      // If populate returned null (animal deleted), mark as removed
      if (!populatedAnimal || !populatedAnimal._id) {
        return { _id: id.toString(), removed: true };
      }
      return populatedAnimal;
    });

    res.json({ favorites });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

export { verifyToken };
