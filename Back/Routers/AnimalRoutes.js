import express from "express";
import {animalCaller, animalExport} from "../Controllers/AnimalController.js"
const router = express.Router();
router.get("/", animalCaller);

router.get("/:id", animalExport)






export default router;
