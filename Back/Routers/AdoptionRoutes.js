import express from "express";
import jwt from "jsonwebtoken";
import { verifyToken } from "../Controllers/UserController.js";
import {
  decideApplication,
  getApplicationForReview,
  submitAdoptionApplication,
} from "../Controllers/AdoptionController.js";

const router = express.Router();

// Optional auth: if user is logged in, capture req.userId without blocking guests
const optionalAuth = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return next();
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
  } catch (e) {
    // ignore
  }
  next();
};

router.post("/:animalId/apply", optionalAuth, submitAdoptionApplication);

// Review endpoints (must be logged-in)
router.get("/applications/:id", verifyToken, getApplicationForReview);
router.put("/applications/:id/decision", verifyToken, decideApplication);

export default router;

