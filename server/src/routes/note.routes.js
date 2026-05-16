import express from "express";
import {
	createNote,
	deleteNote,
	fetchNotes,
	getNoteById,
	updateNote,
} from "../controllers/note.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.post("/", createNote);
router.get("/", fetchNotes);
router.get("/:id", getNoteById);
router.patch("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;
