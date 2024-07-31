const express = require("express");
const app = express();
const mongoose = require("mongoose");

// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("student management");
});

const {registerUser ,getUser , deleteUser} = require("./controllers/userControllers");
// // Authentication routes
app.post("/register/user", registerUser);
app.get("/registeruser/getuser", getUser);
app.post("/deleteUser", deleteUser)

// Connect to MongoDB and start the server
mongoose
  .connect("mongodb://localhost:27017/learning_mongodb")
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });