const express = require("express");
const multer = require("multer");
const fs = require("fs");

const app = express();
const port = 8000; // Choose any port you want

// Define storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, "image.jpg");
  },
});

// Create multer instance
const upload = multer({ storage: storage });
//console.log(upload);
// Define route to handle file upload
app.post("/upload", upload.single("image"), (req, res) => {
  console.log(req.body);
  // File has been uploaded successfully
  console.log("File uploaded:", req.file);
  res.send("File uploaded successfully.");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://192.168.125.25:${port}`);
});
