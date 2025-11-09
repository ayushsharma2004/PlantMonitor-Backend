import { db, admin } from "../DB/firestore.js";

// ========== 1️⃣ Update or Add Plant Data ==========
export const updatePlantData = async (req, res) => {
  try {
    const {
      plantId,
      plantName,
      plantCategory,
      moisture,
      temperature,
      humidity,
    } = req.body;

    // ✅ Validation for required fields
    if (!plantId || !plantName || !plantCategory) {
      return res.status(400).send({
        success: false,
        message: "Plant ID, name, and category are required",
      });
    }

    // ✅ Firestore document reference
    const plantRef = db.collection("plants").doc(plantId);

    // ✅ Build update object dynamically
    const updateData = {
      plantId,
      plantName,
      plantCategory,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    // ✅ Add optional fields only if they exist in request
    if (moisture !== undefined) updateData.moisture = moisture;
    if (temperature !== undefined) updateData.temperature = temperature;
    if (humidity !== undefined) updateData.humidity = humidity;

    // ✅ Update or create document (merge keeps existing data)
    await plantRef.set(updateData, { merge: true });

    return res.status(200).send({
      success: true,
      message: "Plant data updated successfully",
      plant: updateData,
    });
  } catch (error) {
    console.error("Error updating plant data:", error);
    return res.status(500).send({
      success: false,
      message: "Error updating plant data",
      error: error.message,
    });
  }
};

// ========== 2️⃣ Read All Plants ==========
export const readAllPlants = async (req, res) => {
  try {
    const snapshot = await db.collection("plants").get();

    if (snapshot.empty) {
      return res.status(200).send({
        success: true,
        message: "No plant data found",
        plants: [],
      });
    }

    const plants = snapshot.docs.map((doc) => doc.data());

    return res.status(200).send({
      success: true,
      message: "All plant data retrieved successfully",
      plants: plants,
    });
  } catch (error) {
    console.error("Error reading all plants:", error);
    return res.status(500).send({
      success: false,
      message: "Error reading all plants",
      error: error.message,
    });
  }
};

// ========== 3️⃣ Read Single Plant ==========
export const readSinglePlant = async (req, res) => {
  try {
    const { plantId } = req.params;

    if (!plantId) {
      return res.status(400).send({
        success: false,
        message: "Plant ID is required",
      });
    }

    const plantDoc = await db.collection("plants").doc(plantId).get();

    if (!plantDoc.exists) {
      return res.status(404).send({
        success: false,
        message: "Plant not found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Plant data retrieved successfully",
      plant: plantDoc.data(),
    });
  } catch (error) {
    console.error("Error reading single plant:", error);
    return res.status(500).send({
      success: false,
      message: "Error reading plant data",
      error: error.message,
    });
  }
};
