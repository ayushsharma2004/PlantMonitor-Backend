import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getAntennaDataset = async (req, res) => {
  try {
    const results = [];

    // ✅ Updated to match your exact filename
    const csvFilePath = path.join(
      __dirname,
      "../data/5G_Beyond_Antenna_Simulation_Data.csv",
    );

    // Check if file exists before trying to read it
    if (!fs.existsSync(csvFilePath)) {
      console.error(`🚨 File missing at: ${csvFilePath}`);
      return res.status(404).send({
        success: false,
        message: `Dataset file not found on the server. Looked in: ${csvFilePath}`,
      });
    }

    // Stream and parse the CSV file
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on("data", (data) => {
        results.push({
          Frequency_GHz: parseFloat(data.Frequency_GHz),
          Dielectric_Constant: parseFloat(data.Dielectric_Constant),
          Height_mm: parseFloat(data.Height_mm),
          Patch_Width_mm: parseFloat(data.Patch_Width_mm),
          Patch_Length_mm: parseFloat(data.Patch_Length_mm),
          S11_dB: parseFloat(data.S11_dB),
          Gain_dBi: parseFloat(data.Gain_dBi),
        });
      })
      .on("end", () => {
        return res.status(200).send({
          success: true,
          message: "Antenna dataset retrieved successfully",
          total_samples: results.length,
          dataset: results,
        });
      })
      .on("error", (error) => {
        throw new Error(error.message);
      });
  } catch (error) {
    console.error("Error reading antenna dataset:", error);
    return res.status(500).send({
      success: false,
      message: "Error processing the dataset",
      error: error.message,
    });
  }
};
