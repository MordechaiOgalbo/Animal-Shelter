import express from "express";
import {animalCaller} from "../Controllers/AnimalController.js"
const router = express.Router();
router.get("/", animalCaller);

export default router;
