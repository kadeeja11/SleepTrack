// Import mongoose
const mongoose = require('mongoose');

// Define the schema for the sleep entry
const sleepSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Assuming you have a User model
    },
    date: {
        type: Date,
        required: true
    },
    sleep_time: {
        type: String,
        required: true
    },
    wake_up_time: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    }
});

// Create the SleepModel
const SleepModel = mongoose.model('SleepModel', sleepSchema, 'sleep_entries');

// Export the SleepModel
module.exports = SleepModel;
