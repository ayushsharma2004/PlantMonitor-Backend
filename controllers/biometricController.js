import express from "express";
import {
  addBiometricReading,
  readSessionBiometrics,
  getLatestReading,
} from "../controllers/biometricController.js";

const router = express.Router();

// POST → Add new biometric reading from ESP32
router.post("/log", addBiometricReading);

// GET → Read all biometrics for a specific session
router.get("/session/:sessionId", readSessionBiometrics);

// GET → Get the latest single reading (for real-time dashboard)
router.get("/latest", getLatestReading);

export default router;
