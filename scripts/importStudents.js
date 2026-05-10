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

const importStudents = async () => {

  try {

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

    console.error("Import Error:", error);
  }
};

importStudents();