import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    selectedHour: {
        type: String,
        required: true,
    },
    partySize: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
        // Assuming email should be unique
        trim: true, // Remove leading/trailing spaces
        lowercase: true, // Store email in lowercase
    },
    phone: {
        type: String,
        required: true,
    },
});

export default mongoose.model("Booking", bookingSchema);