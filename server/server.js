const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "studentdata",
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL");
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Specify the directory where files will be saved
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000, // 1 MB per file
    files: 2, // Up to 2 files (photo and marksheet)
  },
});

// API to create a new record
app.post(
  "/api/data",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "marksheet", maxCount: 1 },
  ]),
  (req, res) => {
    const photoFile = req.files.photo[0];
    const marksheetFile = req.files.marksheet[0];

    const photoPath = "/uploads/" + photoFile.filename;
    const marksheetPath = "/uploads/" + marksheetFile.filename;

    const { Name, Email, DOB, Address } = req.body;
    const query =
      "INSERT INTO studentdetails (Name, Email, DOB, Address, photo_url, marksheet_url) VALUES (?, ?, ?, ?, ?, ?)";

    db.query(
      query,
      [Name, Email, DOB, Address, photoPath, marksheetPath],
      (err, result) => {
        if (err) {
          console.error("Error executing query:", err);
          res.status(500).send("Error inserting data into the database");
          return;
        }

        res.json({
          message: "Data inserted successfully",
          id: result.insertId,
        });
      }
    );
  }
);


// API to fetch URLs from the database
app.get("/api/students/:id", (req, res) => {
  const studentId = req.params.id;

  const selectQuery =
    "SELECT photo_url, marksheet_url FROM students WHERE id = ?";

  db.query(selectQuery, [studentId], (err, results) => {
    if (err) {
      console.error("Error executing select query:", err);
      res.status(500).send("Error fetching data from the database");
      return;
    }

    if (results.length === 0) {
      res.status(404).send("Student not found");
    } else {
      const studentUrls = {
        photo_url: results[0].photo_url,
        marksheet_url: results[0].marksheet_url,
      };
      res.json(studentUrls);
    }
  });
});

// API to update data by ID
app.put(
  "/api/data/:id",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "marksheet", maxCount: 1 },
  ]),
  (req, res) => {
    const { id } = req.params;
    const photoFile = req.files.photo[0];
    const marksheetFile = req.files.marksheet[0];

    const photoPath = "/uploads/" + photoFile.filename;
    const marksheetPath = "/uploads/" + marksheetFile.filename;
    const { Name, Email, DOB, Address } = req.body;

    const updateQuery =
      "UPDATE studentdetails SET Name=?, Email=?, DOB=?, Address=?, photo_url=?, marksheet_url=? WHERE id=?";

    db.query(
      updateQuery,
      [Name, Email, DOB, Address, photoPath, marksheetPath, id],
      (err, result) => {
        if (err) {
          console.error("Error executing update query:", err);
          res.status(500).send("Error updating data in the database");
          return;
        }

        if (result.affectedRows === 0) {
          res.status(404).send("Record not found");
        } else {
          res.json({ message: "Data updated successfully" });
        }
      }
    );
  }
);

// API to delete data by ID
app.delete("/api/data/:id", (req, res) => {
  const { id } = req.params;

  const deleteQuery = "DELETE FROM studentdetails WHERE id=?";

  db.query(deleteQuery, [id], (err, result) => {
    if (err) {
      console.error("Error executing delete query:", err);
      res.status(500).send("Error deleting data from the database");
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).send("Record not found");
    } else {
      res.json({ message: "Data deleted successfully" });
    }
  });
});

// API to get all data
app.get("/api/data", (req, res) => {
  const query = "SELECT * FROM studentdetails";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Error retrieving data from the database");
      return;
    }

    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
