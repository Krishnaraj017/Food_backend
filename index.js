const mongoose = require("mongoose");
const express = require("express");
const axios = require("axios");

const app = express();
const port = 8000;

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1/mydb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const foodItemSchema = new mongoose.Schema({
  foodName: {
    type: String,
    required: true,
  },
  proteins: {
    type: Number,
    required: true,
  },
  carbs: {
    type: Number,
    required: true,
  },
  fats: {
    type: Number,
    required: true,
  },
  calories: {
    type: Number,
    required: true,
  },
  // You can add more fields as needed
});

// Create the FoodItem model
const FoodItem = mongoose.model("FoodItem", foodItemSchema);

// Array of food items
const foodItems = [
  {
    foodName: "Banana",
    proteins: 1.3,
    carbs: 27,
    fats: 0.3,
    calories: 105,
  },
  {
    foodName: "Apple",
    proteins: 0.5,
    carbs: 25,
    fats: 0.3,
    calories: 95,
  },
  // Add more food items as needed
];

// Save each food item to the database
FoodItem.insertMany(foodItems)
  .then((result) => {
    console.log("Food items saved successfully:", result);
  })
  .catch((error) => {
    console.error("Error saving food items:", error);
  });

//fetching nutritens from database from model predicted name
app.get("/food/:name", async (req, res) => {
  const foodName = req.params.name;
  //const foodName = "Apple"; // Dummy food name

  try {
    // Find the food item by its name
    const foodItem = await FoodItem.findOne({ foodName });

    if (!foodItem) {
      return res.status(404).json({ error: "Food not found" });
    }
    console.log(foodItem);

    //  res.json(foodItem);
    // Send the foodItem data as JSON in the POST request to /food/nutrients endpoint
    // const response = await axios.post(
    //   "http://localhost:8000/food/nutrients",
    //   foodItem
    // );

    // Send the response received from the other API back to the client
    res.json(foodItem);
  } catch (error) {
    console.error("Error retrieving food details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// app.post("/food/nutrients", async (req, res) => {});

// app.post("/food/nutrients", async (req, res) => {
//   const foodItem = req.body;

//   // Perform further processing with the received food item data

//   // Send a response back (this is just a placeholder, you should customize this)
//   res.json({ message: "Received food item data successfully" });
// });

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://127.0.0.1:${port}`);
});
