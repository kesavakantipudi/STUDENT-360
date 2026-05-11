import admin from "firebase-admin";

import serviceAccount from "./serviceAccountKey.json" with { type: "json" };

import students from "./students.json" with { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

db.settings({
  ignoreUndefinedProperties: true,
});

// Delay helper
const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetch students from Maya Technical Student Info API
 */
const fetchFromMayaAPI = async () => {
  try {
    console.log("📡 Attempting to fetch from Maya Technical API...");
    const response = await fetch(
      "https://api.mayatechnical.com/students", // Replace with actual endpoint
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Add any required authentication headers
          // "Authorization": "Bearer YOUR_TOKEN"
        },
        timeout: 30000, // 30 second timeout
      }
    );

    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ Successfully fetched ${data.length || 0} students from Maya API`);
    return data;
  } catch (error) {
    console.error("❌ Maya API failed:", error.message);
    return null;
  }
};

/**
 * Fetch students from Firestore as fallback
 */
const fetchFromFirestore = async () => {
  try {
    console.log("📚 Falling back to Firestore...");
    const snapshot = await db.collection("students").get();
    const firestoreStudents = [];

    snapshot.forEach((doc) => {
      firestoreStudents.push({
        roll_no: doc.data().rollNo,
        first_name: doc.data().name,
        gender: doc.data().gender,
        college: doc.data().college,
        branch: doc.data().branch,
        passout_year: doc.data().passoutYear,
        dob: doc.data().dob,
        section: doc.data().section,
        backlogs: doc.data().backlogs,
        btech: doc.data().btech,
      });
    });

    console.log(`✅ Successfully fetched ${firestoreStudents.length} students from Firestore`);
    return firestoreStudents;
  } catch (error) {
    console.error("❌ Firestore fetch failed:", error.message);
    return null;
  }
};

/**
 * Get student data from API with Firestore fallback
 */
const getStudentData = async () => {
  // Try Maya API first
  let studentData = await fetchFromMayaAPI();

  // If API fails, fall back to Firestore
  if (!studentData || studentData.length === 0) {
    console.log("⚠️  Using local JSON file as primary source...");
    studentData = students;

    // If local file is also empty, try Firestore
    if (!studentData || studentData.length === 0) {
      console.log("⚠️  Local JSON file is empty, attempting Firestore fallback...");
      const firestoreData = await fetchFromFirestore();
      if (firestoreData && firestoreData.length > 0) {
        studentData = firestoreData;
        console.log("✅ Using Firestore data as fallback");
      } else {
        throw new Error("All data sources failed: API, Local JSON, and Firestore are unavailable");
      }
    }
  }

  return studentData;
};

const importStudents = async () => {

  try {

    // Get student data with fallback mechanism
    const students = await getStudentData();

    if (!students || students.length === 0) {
      throw new Error("No student data available from any source");
    }

    // Smaller batch size
    const batchSize = 25;

    let batch = db.batch();

    let operationCount = 0;

    let totalImported = 0;

    for (const student of students) {

      if (!student.roll_no) continue;

      const studentRef = db
        .collection("students")
        .doc(student.roll_no);

      batch.set(studentRef, {

        rollNo: student.roll_no || null,

        name: student.first_name || null,

        gender: student.gender || null,

        college: student.college || null,

        branch: student.branch || [],

        passoutYear: student.passout_year || null,

        dob: student.dob || null,

        section: student.section || [],

        backlogs: student.backlogs || 0,

        btech: student.btech || null,

      });

      operationCount++;

      totalImported++;

      // Cleaner logs
      if (totalImported % 100 === 0) {

        console.log(`${totalImported} students prepared`);
      }

      // Commit every 100 docs
      if (operationCount === batchSize) {

        await batch.commit();

        console.log(
          `Batch committed: ${totalImported} students imported`
        );

        // Small delay to avoid quota exhaustion
        await sleep(5000);

        batch = db.batch();

        operationCount = 0;
      }
    }

    // Commit remaining docs
    if (operationCount > 0) {

      await batch.commit();

      console.log("Final batch committed");
    }

    console.log(
      `All students imported successfully: ${totalImported}`
    );

  } catch (error) {

    console.error("❌ Import Error:", error);
    process.exit(1);
  }
};

importStudents();