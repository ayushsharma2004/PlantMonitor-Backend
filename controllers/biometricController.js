import { db, admin } from "../DB/firestore.js";

// ========== 1️⃣ Add New Biometric Reading (POST from ESP32) ==========
export const addBiometricReading = async (req, res) => {
  try {
    const {
      heartRate,
      spo2,
      gsr,
      sessionId, // Optional: To group data to a specific interview
      userId, // Optional: To link data to a specific user
    } = req.body;

    var a;

    // ✅ Validation for required fields from the ESP32
    if (heartRate === undefined || gsr === undefined) {
      return res.status(400).send({
        success: false,
        message: "Heart Rate and GSR are required fields",
      });
    }

    // ✅ Firestore collection reference
    // We use a collection called "biometric_logs" to store the time-series stream
    const biometricRef = db.collection("biometric_logs");

    // ✅ Build the data object
    const newReading = {
      heartRate: Number(heartRate),
      spo2: Number(spo2) || 0,
      gsr: Number(gsr),
      sessionId: sessionId || "current_active_session",
      userId: userId || "anonymous_user",
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    };

    // ✅ Add new document for this exact second in time
    const docRef = await biometricRef.add(newReading);

    return res.status(200).send({
      success: true,
      message: "Biometric reading logged successfully",
      logId: docRef.id,
      data: newReading,
    });
  } catch (error) {
    console.error("Error adding biometric data:", error);
    return res.status(500).send({
      success: false,
      message: "Error adding biometric data",
      error: error.message,
    });
  }
};

// ========== 2️⃣ Read All Biometrics for a Specific Session ==========
export const readSessionBiometrics = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).send({
        success: false,
        message: "Session ID is required to fetch logs",
      });
    }

    // ✅ Query Firestore to get all readings for this specific interview, ordered by time
    const snapshot = await db
      .collection("biometric_logs")
      .where("sessionId", "==", sessionId)
      .orderBy("timestamp", "asc")
      .get();

    if (snapshot.empty) {
      return res.status(200).send({
        success: true,
        message: "No biometric data found for this session",
        logs: [],
      });
    }

    const logs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).send({
      success: true,
      message: "Session biometric data retrieved successfully",
      count: logs.length,
      logs: logs,
    });
  } catch (error) {
    console.error("Error reading session biometrics:", error);
    return res.status(500).send({
      success: false,
      message: "Error reading biometric data",
      error: error.message,
    });
  }
};

// ========== 3️⃣ Get the Latest Single Reading (For Real-time Dashboard) ==========
export const getLatestReading = async (req, res) => {
  try {
    // ✅ Fetch just the most recent document
    const snapshot = await db
      .collection("biometric_logs")
      .orderBy("timestamp", "desc")
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).send({
        success: false,
        message: "No biometric data found",
      });
    }

    const latestDoc = snapshot.docs[0];

    return res.status(200).send({
      success: true,
      message: "Latest reading retrieved",
      data: {
        id: latestDoc.id,
        ...latestDoc.data(),
      },
    });
  } catch (error) {
    console.error("Error reading latest biometric data:", error);
    return res.status(500).send({
      success: false,
      message: "Error reading latest biometric data",
      error: error.message,
    });
  }
};
