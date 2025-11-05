import express from "express";
import { allUsers } from "../Controllers/UserController.js";

const router = express.Router();
router.get("/", allUsers);

export default router;
