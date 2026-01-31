import express from "express";
import { verifyToken } from "../Controllers/UserController.js";
import {
  getMyNotifications,
  getNotificationById,
  deleteNotification,
  markAllNotificationsRead,
  markNotificationRead,
  restoreNotification,
} from "../Controllers/NotificationController.js";

const router = express.Router();

router.get("/me", verifyToken, getMyNotifications);
router.get("/me/:id", verifyToken, getNotificationById);
router.put("/me/read-all", verifyToken, markAllNotificationsRead);
router.put("/me/:id/read", verifyToken, markNotificationRead);
router.put("/me/:id/delete", verifyToken, deleteNotification);
router.put("/me/:id/restore", verifyToken, restoreNotification);

export default router;

