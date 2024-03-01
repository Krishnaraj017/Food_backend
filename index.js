//This is used to add more foodNames to DB and add nutrient contents explicitely

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
    type: String,
    required: true,
  },
  carbs: {
    type: String,
    required: true,
  },
  fats: {
    type: String,
    required: true,
  },
  calories: {
    type: String,
    required: true,
  },
  quantity: {
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
    quantity:1,
  },
  {
    foodName: "Apple",
    proteins: 0.5,
    carbs: 25,
    fats: 0.3,
    calories: 95,
    quantity:2,
  },
   {
    foodName: "Grape",
    proteins: 0.5,
    carbs: 25,
    fats: 0.3,
    calories: 95,
    quantity:2,
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

    

    // Send the response received from the other API back to the client
    res.json(foodItem);
  } catch (error) {
    console.error("Error retrieving food details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://127.0.0.1:${port}`);
});
