import express from "express";
import { allUsers, getCurrentUser, updateUser, changePassword, deleteUser, addToFavorites, removeFromFavorites, getFavorites, verifyToken } from "../Controllers/UserController.js";

const router = express.Router();
router.get("/", allUsers);
router.get("/me", verifyToken, getCurrentUser);
router.put("/me", verifyToken, updateUser);
router.put("/me/password", verifyToken, changePassword);
router.post("/me/delete", verifyToken, deleteUser);
router.delete("/me", verifyToken, deleteUser);
router.post("/me/favorites", verifyToken, addToFavorites);
router.delete("/me/favorites", verifyToken, removeFromFavorites);
router.get("/me/favorites", verifyToken, getFavorites);

export default router;
