import express from "express";
import { verifyToken } from "../Controllers/UserController.js";
import {
  verifyAdmin,
  getDashboardStats,
  getAllAnimals,
  getAllUsers,
  updateUserRole,
  deleteUserAdmin,
  deleteAnimal,
  updateAnimal,
  getAllApplications,
  deleteApplication,
  toggleAnimalAdopted,
  getAllNotifications,
  deleteNotificationAdmin,
} from "../Controllers/AdminController.js";

const router = express.Router();

// All admin routes require authentication + admin role
router.use(verifyToken);
router.use(verifyAdmin);

router.get("/dashboard", getDashboardStats);
router.get("/animals", getAllAnimals);
router.get("/users", getAllUsers);
router.get("/applications", getAllApplications);
router.get("/notifications", getAllNotifications);
router.put("/users/:userId/role", updateUserRole);
router.delete("/users/:userId", deleteUserAdmin);
router.put("/animals/:animalId", updateAnimal);
router.delete("/animals/:animalId", deleteAnimal);
router.put("/animals/:animalId/toggle-adopted", toggleAnimalAdopted);
router.delete("/applications/:applicationId", deleteApplication);
router.delete("/notifications/:notificationId", deleteNotificationAdmin);

export default router;
