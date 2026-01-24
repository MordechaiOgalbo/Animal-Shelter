import express from "express";
import { allUsers, getCurrentUser, updateUser, changePassword, verifyToken } from "../Controllers/UserController.js";

const router = express.Router();
router.get("/", allUsers);
router.get("/me", verifyToken, getCurrentUser);
router.put("/me", verifyToken, updateUser);
router.put("/me/password", verifyToken, changePassword);

export default router;
