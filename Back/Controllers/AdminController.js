import User from "../Models/User.js";
import Animal from "../Models/Animal.js";
import AdoptionApplication from "../Models/AdoptionApplication.js";
import Notification from "../Models/Notification.js";

// Middleware to verify admin role
export const verifyAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

// Dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAnimals = await Animal.countDocuments();
    const adoptedAnimals = await Animal.countDocuments({ adopted: true });
    const availableAnimals = await Animal.countDocuments({ adopted: { $ne: true } });
    const totalApplications = await AdoptionApplication.countDocuments();
    const pendingApplications = await AdoptionApplication.countDocuments({ status: "submitted" });
    const acceptedApplications = await AdoptionApplication.countDocuments({ status: "accepted" });
    const rejectedApplications = await AdoptionApplication.countDocuments({ status: "rejected" });
    const totalNotifications = await Notification.countDocuments({ deleted: false });

    res.json({
      users: { total: totalUsers },
      animals: {
        total: totalAnimals,
        adopted: adoptedAnimals,
        available: availableAnimals,
      },
      applications: {
        total: totalApplications,
        pending: pendingApplications,
        accepted: acceptedApplications,
        rejected: rejectedApplications,
      },
      notifications: { total: totalNotifications },
    });
  } catch (error) {
    console.error("getDashboardStats error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Get all animals (including adopted)
export const getAllAnimals = async (req, res) => {
  try {
    const animals = await Animal.find()
      .populate("submitted_by", "user_name email")
      .populate("adopted_by", "user_name email")
      .sort({ createdAt: -1 });
    res.json({ animals });
  } catch (error) {
    console.error("getAllAnimals error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password -reset_token -reset_token_expiry")
      .sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    console.error("getAllUsers error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Update user role
export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!["user", "staff", "admin"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    // Prevent changing own role
    if (userId === req.userId) {
      return res.status(400).json({ error: "Cannot change your own role" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select("-password -reset_token -reset_token_expiry");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("updateUserRole error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Delete user (admin only)
export const deleteUserAdmin = async (req, res) => {
  try {
    const { userId } = req.params;

    // Prevent deleting yourself
    if (userId === req.userId) {
      return res.status(400).json({ error: "Cannot delete your own account" });
    }

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("deleteUserAdmin error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Delete animal
export const deleteAnimal = async (req, res) => {
  try {
    const { animalId } = req.params;
    const animal = await Animal.findByIdAndDelete(animalId);
    if (!animal) {
      return res.status(404).json({ error: "Animal not found" });
    }
    res.json({ message: "Animal deleted successfully" });
  } catch (error) {
    console.error("deleteAnimal error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Get all applications
export const getAllApplications = async (req, res) => {
  try {
    const applications = await AdoptionApplication.find()
      .populate("animal", "name img category type")
      .populate("applicant_user", "user_name email")
      .populate("reviewed_by", "user_name")
      .sort({ createdAt: -1 });
    res.json({ applications });
  } catch (error) {
    console.error("getAllApplications error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Delete application (admin)
export const deleteApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const application = await AdoptionApplication.findByIdAndDelete(applicationId);
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }
    res.json({ message: "Application deleted successfully" });
  } catch (error) {
    console.error("deleteApplication error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Toggle animal adopted status
export const toggleAnimalAdopted = async (req, res) => {
  try {
    const { animalId } = req.params;
    const animal = await Animal.findById(animalId);
    if (!animal) {
      return res.status(404).json({ error: "Animal not found" });
    }

    animal.adopted = !animal.adopted;
    if (animal.adopted) {
      animal.adopted_at = new Date();
    } else {
      animal.adopted_by = null;
      animal.adopted_at = null;
    }
    await animal.save();

    res.json({ animal });
  } catch (error) {
    console.error("toggleAnimalAdopted error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Update animal (admin)
export const updateAnimal = async (req, res) => {
  try {
    const { animalId } = req.params;
    const {
      name,
      category,
      type,
      animal: animalType,
      breed,
      gender,
      age,
      life_expectancy,
      medical_condition,
      tameness_level,
      care_requirements,
      adoption_type,
      foster_duration,
      address,
      img,
    } = req.body;

    const animal = await Animal.findById(animalId);
    if (!animal) {
      return res.status(404).json({ error: "Animal not found" });
    }

    // Parse nested objects if they're strings
    let lifeExpectancyObj = animal.life_expectancy || {};
    if (life_expectancy) {
      try {
        lifeExpectancyObj = typeof life_expectancy === "string" 
          ? JSON.parse(life_expectancy) 
          : life_expectancy;
      } catch (e) {
        if (req.body.life_expectancy_captivity || req.body.life_expectancy_wild) {
          lifeExpectancyObj = {
            captivity: req.body.life_expectancy_captivity || "",
            wild: req.body.life_expectancy_wild || "",
          };
        }
      }
    }

    let careRequirementsObj = animal.care_requirements || {};
    if (care_requirements) {
      try {
        careRequirementsObj = typeof care_requirements === "string"
          ? JSON.parse(care_requirements)
          : care_requirements;
      } catch (e) {
        if (req.body.care_food || req.body.care_attention || req.body.care_yearly_cost ||
            req.body.care_vet_cost || req.body.care_insurance) {
          careRequirementsObj = {
            food: req.body.care_food || "",
            attention: req.body.care_attention || "",
            yearly_cost: req.body.care_yearly_cost || "",
            average_vet_cost: req.body.care_vet_cost || "",
            insurance: req.body.care_insurance || "",
          };
        }
      }
    }

    // Update fields
    if (name !== undefined) animal.name = name;
    if (category !== undefined) animal.category = category;
    if (type !== undefined) animal.type = type;
    if (animalType !== undefined) animal.animal = animalType;
    if (breed !== undefined) animal.breed = breed;
    if (gender !== undefined) animal.gender = gender;
    if (age !== undefined) animal.age = age ? Number(age) : undefined;
    if (life_expectancy !== undefined) animal.life_expectancy = lifeExpectancyObj;
    if (medical_condition !== undefined) animal.medical_condition = medical_condition;
    if (tameness_level !== undefined) animal.tameness_level = tameness_level;
    if (care_requirements !== undefined) animal.care_requirements = careRequirementsObj;
    if (adoption_type !== undefined) animal.adoption_type = adoption_type;
    if (foster_duration !== undefined) animal.foster_duration = foster_duration;
    if (address !== undefined) animal.address = address;
    if (img !== undefined) animal.img = img;

    await animal.save();

    res.json({ animal });
  } catch (error) {
    console.error("updateAnimal error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Get all notifications (admin)
export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ deleted: false })
      .populate("recipient", "user_name email")
      .sort({ createdAt: -1 })
      .limit(500);
    res.json({ notifications });
  } catch (error) {
    console.error("getAllNotifications error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Delete notification (admin)
export const deleteNotificationAdmin = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const notif = await Notification.findByIdAndDelete(notificationId);
    if (!notif) {
      return res.status(404).json({ error: "Notification not found" });
    }
    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("deleteNotificationAdmin error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};
