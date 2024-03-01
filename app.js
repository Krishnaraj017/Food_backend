const express = require("express");
const multer = require("multer");
const fs = require("fs");
const mongoose = require("mongoose");

const app = express();
const port = 8000;

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1/mydb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Define Mongoose schema
const imageSchema = new mongoose.Schema({
  image: { data: Buffer, contentType: String },
});

const Image = mongoose.model("Image", imageSchema);

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

// Define route to handle file upload
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    // Read the uploaded image
    const img = fs.readFileSync(req.file.path);
    // Encode the image data as a base64 string
    const encodedImg = img.toString("base64");

    // Create a new document to store the image
    const newImage = new Image({
      image: {
        data: Buffer.from(encodedImg, "base64"),
        contentType: req.file.mimetype,
      },
    });
console.log(newImage);
    // Save the image to the database
    await newImage.save();

    // Remove the uploaded file from disk
    fs.unlinkSync(req.file.path);

    res.send("File uploaded and saved to database successfully.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error uploading file.");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://192.168.125.25:${port}`);
});
