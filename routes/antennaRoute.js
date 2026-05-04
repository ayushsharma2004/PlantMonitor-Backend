import express from "express";
import { getAntennaDataset } from "../controllers/antennaController.js";

const router = express.Router();

// GET → Read and return the massive CSV dataset
router.get("/dataset", getAntennaDataset);

export default router;
