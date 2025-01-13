const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
require("dotenv").config();
const logger = require("morgan");
const app = express();

// Set EJS as the templating engine
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));

// Route for home page (Form to input multiple student IDs and semester ID)
app.get("/", async (req, res) => {
  try {
    // Fetch semester list from the API
    const response = await axios.get("http://software.diu.edu.bd:8006/result/semesterList");
    const semesterList = response.data;

    // Render the form with the semester list
    res.render("index", { semesterList });
  } catch (error) {
    console.error("Error fetching semester list:", error.message);
    res.status(500).send("Failed to fetch semester list.");
  }
});

// Fetch and display results for multiple students
app.post("/results", async (req, res) => {
  const { studentIds, semesterId } = req.body;

  // Split the textarea input by commas and remove extra spaces
  const studentIdArray = studentIds.split(",").map((id) => id.trim());

  const results = [];

  try {
    // Fetch result for each student ID
    for (const studentId of studentIdArray) {
      const resultUrl = `http://software.diu.edu.bd:8006/result?grecaptcha=&semesterId=${semesterId}&studentId=${studentId}`;
      const infoUrl = `http://software.diu.edu.bd:8006/result/studentInfo?studentId=${studentId}`;

      try {
        const resultResponse = await axios.get(resultUrl);
        const resultData = resultResponse.data;

        const infoResponse = await axios.get(infoUrl);
        const studentInfo = infoResponse.data;

        results.push({
          studentId,
          studentInfo,
          resultData,
          cgpa: resultData[0]?.cgpa || "N/A",
        });
      } catch (error) {
        console.error(`Error fetching data for ${studentId}:`, error.message);
        results.push({
          studentId,
          error: `Failed to fetch result for ${studentId}`,
        });
      }
    }

    res.render("results", { results });
  } catch (error) {
    console.error("Error fetching results:", error.message);
    res.status(500).render("results", { error: "Failed to fetch results." });
  }
});

// Start the server
app.listen(8080, () => {
  console.log(`Server running`);
});
