// Import necessary modules
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const path = require('path');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

// Import the User model
const UserModel = require("./models/User");
const SleepModel = require("./models/SleepModel");
const cors = require('cors'); // Import cors package

// Mongoose file for connection
const mongoose = require("mongoose");

// Connect to MongoDB Atlas (online database)
mongoose.connect("mongodb+srv://farhakadeeja630:farhakadeeja630@cluster0.3aebb35.mongodb.net/SleepTracker?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Connection successful"))
.catch(err => console.log("Connection failed"));

const app = express();

app.use(cors());

// Middleware setup
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Define routes

// Route to handle signup form submission
app.post("/api/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Create a new user instance with the provided data
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new UserModel({
      username: username,
      email: email,
      password: hashedPassword
    });

    // Save the user to the database
    await user.save();

    console.log("User signed up successfully:", user);
    return res.status(200).json({ message: "Signup successful", userId: user._id });
  } catch (error) {
    console.error("Error signing up:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email in the database
    const user = await UserModel.findOne({ email });

    // If user is not found, return unauthorized status
    if (!user) {
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }

    // Check if password matches
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    // If password doesn't match, return unauthorized status
    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Unauthorized: Incorrect password" });
    }

    // If user is found and password matches, login successful
    console.log("Login successful for user:", user);
    return res.status(200).json({ message: "Login successful", userId: user._id });
  } catch (error) {
    console.error("Error logging in:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Backend (SleepTracker.js)

const moment = require('moment');

app.post('/api/sleep', async (req, res) => {
    const { userId } = req.query; // Extract user ID from URL query parameter
    const { date, sleepTime, wakeUpTime } = req.body;

    try {
        // Calculate sleep duration
        const sleepDuration = calculateDuration(sleepTime, wakeUpTime);

        // Create a new sleep entry
        const sleepEntry = new SleepModel({
            user_id: userId, // Associate sleep entry with the user
            date: date,
            sleep_time: sleepTime,
            wake_up_time: wakeUpTime,
            duration: sleepDuration
        });

        // Save the sleep entry to the database
        await sleepEntry.save();

        // Fetch all sleep entries for the user
        const allSleepEntries = await SleepModel.find({ user_id: userId });

        // Respond with success message and updated sleep data
        return res.status(200).json(allSleepEntries);
    } catch (error) {
        console.error('Error storing sleep data:', error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});



// Route to serve the sleeptrack.html file
app.get("/sleeptrack", async (req, res) => {
  // Construct the file path to sleeptrack.html
  const filePath = path.join(__dirname, 'public', 'sleeptrack.html');
  res.sendFile(filePath);
});

// Add a route for logout
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/profile');
        }
        res.redirect('/homepage.html');
    });
});



function calculateDuration(sleepTime, wakeUpTime) {
    // Convert sleepTime and wakeUpTime strings to Date objects
    const sleepDate = new Date(`2000-01-01T${sleepTime}`);
    const wakeUpDate = new Date(`2000-01-01T${wakeUpTime}`);

    // Calculate the duration in milliseconds
    let durationMs = wakeUpDate - sleepDate;

    // Convert duration to minutes
    let durationMinutes = durationMs / (1000 * 60);

    return durationMinutes;
}



// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
