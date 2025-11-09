import express from "express";
import {
  updatePlantData,
  readAllPlants,
  readSinglePlant,
} from "../controllers/plantController.js";

const router = express.Router();

// POST → Add or update plant details
router.post("/update-plant", updatePlantData);

// GET → Read all plants
router.get("/all-plants", readAllPlants);

// GET → Read one plant by ID
router.get("/plant/:plantId", readSinglePlant);

export default router;
