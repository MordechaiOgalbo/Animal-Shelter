import express from "express";
import { animalCaller, animalExport, createAnimal } from "../Controllers/AnimalController.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/", animalCaller);
router.get("/:id", animalExport);
// Optional auth: if user is logged in, capture req.userId without blocking guests
router.post(
  "/",
  (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) return next();
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.userId;
    } catch (e) {
      // ignore invalid token for this route
    }
    next();
  },
  createAnimal
);

export default router;
