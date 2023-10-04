import express from "express";
import {
  getAllData,
  savingContactUs,
  deleteContact,
} from "../controllers/contactTable.js";

const router = express.Router();

router.get("/", getAllData);
router.post("/", savingContactUs);
router.delete("/:id", deleteContact);

export default router;