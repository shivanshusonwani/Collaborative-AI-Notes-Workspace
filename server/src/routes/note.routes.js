import express from "express";
import {
	createNote,
	deleteNote,
	fetchNotes,
	fetchArchivedNotes,
	getNoteById,
	getSharedNote,
	toggleArchive,
	togglePublicShare,
	updateNote,
} from "../controllers/note.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/share/:shareId", getSharedNote);

router.use(protect);

router.post("/", createNote);
router.get("/", fetchNotes);
router.get("/archived", fetchArchivedNotes);

router.get("/:id", getNoteById);
router.patch("/:id", updateNote);
router.delete("/:id", deleteNote);

router.patch("/:id/archive", toggleArchive);
router.patch("/:id/share-toggle", togglePublicShare);

export default router;
