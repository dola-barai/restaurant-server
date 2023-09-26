import Booking from "../models/bookingTable.js";
import mongoose from "mongoose";
import nodemailer from "nodemailer";

export const getAllBooking = async (req, res) => {
    try {
        const reservations = await Booking.find();
        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const doBooking = async (req, res) => {
    try {
        //    console.log(req.body);
        const reservation = new Booking(req.body);

        await reservation.save();

        res.status(201).json(reservation);
    } catch (error) {
        res.status(500).json({ error: "Could not create reservation " });
    }
};

export const deleteBooking = async (req, res) => {
    const { reservationId } = req.params;
    try {
        const deletedReservation = await Booking.findByIdAndRemove(reservationId);

        if (!deletedReservation) {
            return res.status(404).json({ error: "Reservation not found" });
        }

        res.status(200).json({ message: "Reservation deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Could not delete reservation" });
    }
};

export const updateBooking = async (req, res) => {
    const { reservationId } = req.params;
    try {
        const updatedReservation = await Booking.findByIdAndUpdate(
            reservationId,
            req.body,
            { new: true } // Return the updated document
        );

        if (!updatedReservation) {
            return res.status(404).json({ error: "Reservation not found" });
        }

        res.status(200).json(updatedReservation);
    } catch (error) {
        res.status(500).json({ error: "Could not update reservation" });
    }
};

export const confirmingEmail = async (req, res) => {
    const { reservationId, userEmail } = req.body;
    console.log(reservationId);
    console.log(userEmail);

    try {
        // Configure the email transport using your email service provider's settings
        const transporter = nodemailer.createTransport({
            service: "gmail",
            port: 465,
            secure: true,
            logger: true,
            debug: true,
            secureConnection: false,

            auth: {
                user: "kashyapsaurabh0908@gmail.com", // Your Gmail email address
                pass: "eqgvcucvhqidvpks", // Your Gmail password or an app-specific password
            },
            tls: {
                rejectionUnAuthorized: true,
            },
        });

        // Define email data
        const mailOptions = {
            from: "opulenzaverve@gmail.com", // Sender's email address
            to: `${userEmail}`, // Recipient's email address
            subject: "Reservation Confirmation", // Email subject
            text: "Your reservation has been confirmed. Thank you!", // Email text
        };

        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
                res.status(500).json({ message: "Error sending email" });
            } else {
                console.log("Email sent:", info.response);
                res.status(200).json({ message: "Email sent successfully" });
            }
        });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const deletingEmail = async (req, res) => {
    const { reservationId, userEmail } = req.body;
    console.log(reservationId);
    console.log(userEmail);

    try {
        // Configure the email transport using your email service provider's settings
        const transporter = nodemailer.createTransport({
            service: "gmail",
            port: 465,
            secure: true,
            logger: true,
            debug: true,
            secureConnection: false,

            auth: {
                user: "kashyapsaurabh0908@gmail.com", // Your Gmail email address
                pass: "eqgvcucvhqidvpks", // Your Gmail password or an app-specific password
            },
            tls: {
                rejectionUnAuthorized: true,
            },
        });

        // Define email data
        const mailOptions = {
            from: "opulenzaverve@gmail.com", // Sender's email address
            to: `${userEmail}`, // Recipient's email address
            subject: "Reservation Cancelled", // Email subject
            text: "Your reservation has been Canceled. Thank you!", // Email text
        };

        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
                res.status(500).json({ message: "Error sending email" });
            } else {
                console.log("Email sent:", info.response);
                res.status(200).json({ message: "Email sent successfully" });
            }
        });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ message: "Server error" });
    }
};