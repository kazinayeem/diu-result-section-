const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
require("dotenv").config();

const app = express();
const port = 3000;

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/studentResults");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB!");
});

// MongoDB Schema
const studentResultSchema = new mongoose.Schema({
  studentId: String,
  semesterId: String,
  resultData: Object, // Stores the fetched result data
  studentInfo: {
    studentName: String,
    programName: String,
    progShortName: String,
    departmentName: String,
    deptShortName: String,
    batchId: String,
    facultyName: String,
    facShortName: String,
    campusName: String,
    shift: String,
  }, // Stores the student information
});

const StudentResult = mongoose.model("StudentResult", studentResultSchema);

// Hardcoded student array
const students = [
  { studentid: "232-35-158", semesterid: "243" },
  { studentid: "232-35-001", semesterid: "243" },
  {
    studentid: "232-35-003",
    semesterid: "243",
  },
  {
    studentid: "232-35-016",
    semesterid: "243",
  },
];

// Function to fetch and store student results along with student info
const fetchAndStoreResults = async () => {
  for (const student of students) {
    const { studentid, semesterid } = student;

    const resultUrl = `http://software.diu.edu.bd:8006/result?grecaptcha=&semesterId=${semesterid}&studentId=${studentid}`;
    const infoUrl = `http://software.diu.edu.bd:8006/result/studentInfo?studentId=${studentid}`;

    try {
      // Check if result already exists
      const existingResult = await StudentResult.findOne({
        studentId: studentid,
        semesterId: semesterid,
      });

      if (existingResult) {
        console.log(`Result for ${studentid} already exists. Skipping.`);
        continue;
      }

      // Fetch result data
      const resultResponse = await axios.get(resultUrl);
      const resultData = resultResponse.data;

      // Fetch student information
      const infoResponse = await axios.get(infoUrl);
      const studentInfo = infoResponse.data;

      // Store result and student information in MongoDB
      const newResult = new StudentResult({
        studentId: studentid,
        semesterId: semesterid,
        resultData,
        studentInfo: {
          studentName: studentInfo.studentName,
          programName: studentInfo.programName,
          progShortName: studentInfo.progShortName,
          departmentName: studentInfo.departmentName,
          deptShortName: studentInfo.deptShortName,
          batchId: studentInfo.batchId,
          facultyName: studentInfo.facultyName,
          facShortName: studentInfo.facShortName,
          campusName: studentInfo.campusName,
          shift: studentInfo.shift,
        },
      });

      await newResult.save();
      console.log(
        `Fetched and saved result and student info for ${studentid}.`
      );
    } catch (error) {
      console.error(
        `Error fetching result or student info for ${studentid}:`,
        error.message
      );
    }
  }
};

app.get("/", async (req, res) => {
  try {
    const results = await StudentResult.find();
    const cgpaResults = results.map((result) => ({
      studentId: result.studentId,
      studentName: result.studentInfo.studentName,
      semesterId: result.semesterId,
      programName: result.studentInfo.programName,
      cgpa: result.resultData[0]?.cgpa, // Assuming CGPA is consistent for all courses
    }));
    res.status(200).json(cgpaResults);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch results." });
  }
});

// Auto-fetch results when the app starts
app.listen(port, async () => {
  console.log(`Server is running at http://localhost:${port}`);
  console.log("Fetching and storing student results...");
  await fetchAndStoreResults();
  console.log("All results fetched and stored.");
});
