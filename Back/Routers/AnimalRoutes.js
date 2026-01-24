import express from "express";
import { animalCaller, animalExport, createAnimal } from "../Controllers/AnimalController.js";

const router = express.Router();

router.get("/", animalCaller);
router.get("/:id", animalExport);
router.post("/", createAnimal);

export default router;
