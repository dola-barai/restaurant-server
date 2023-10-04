import Contact from "../models/contactdata.js";

export const getAllData = async (req, res) => {
    try {
        const reservations = await Contact.find();
        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const savingContactUs = async (req, res) => {
    try {
        console.log(req.body);
        const reservation = new Contact(req.body);
        console.log(reservation);
        await reservation.save();

        res.status(201).json(reservation);
    } catch (error) {
        res.status(500).json({ error: "Could not create reservation " });
    }
};

export const deleteContact = async (req, res) => {
    const contactId = req.params.id;
    console.log("id", contactId);
    console.log("hello");
    try {
        const deletingContacting = await Contact.findByIdAndRemove(contactId);

        if (!deletingContacting) {
            return res.status(404).json({ error: "Reservation not found" });
        }

        res.status(200).json({ message: "Reservation deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Could not delete reservation" });
    }
};