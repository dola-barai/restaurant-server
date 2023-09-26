import express from "express";
import {
    doBooking,
    getAllBooking,
    deleteBooking,
    confirmingEmail,
    deletingEmail,
} from "../controllers/bookTable.js";

const router = express.Router();

router.get("/", getAllBooking);
router.post("/", doBooking);
router.post("/sendConfirmationEmail", confirmingEmail);
router.post("/sendDeleteEmail", deletingEmail);
router.delete("/:reservationId", deleteBooking);

export default router;