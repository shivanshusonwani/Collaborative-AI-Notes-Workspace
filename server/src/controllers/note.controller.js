import Note from "../models/note.model.js";

export const createNote = async (req, res) => {
	try {
		const { title, content } = req.body;

		// if (!title || !content) {
		// 	return res
		// 		.status(400)
		// 		.json({ message: "Title and content are required" });
		// }

		const newNote = await Note.create({
			title,
			content,
			owner: req.session.userId,
		});

		res.status(201).json(newNote);
	} catch (error) {
		res.status(500).json({ message: "Error creating note" });
	}
};

export const fetchNotes = async (req, res) => {
	try {
		const notes = await Note.find({ owner: req.session.userId }).sort({
			updatedAt: -1,
		});
		res.status(200).json(notes);
	} catch (error) {
		res.status(500).json({ message: "Error fetching notes" });
	}
};

export const getNoteById = async (req, res) => {
	try {
		const note = await Note.findById(req.params.id);

		if (!note) {
			return res.status(404).json({ message: "Note not found" });
		}

		if (note.owner.toString() !== req.session.userId) {
			return res.status(403).json({
				message: "Unauthorized: You do not own this note",
			});
		}

		res.status(200).json(note);
	} catch (error) {
		res.status(500).json({ message: "Error fetching note" });
	}
};

export const updateNote = async (req, res) => {
	try {
		const { title, content } = req.body;

		if (!title && !content) {
			return res
				.status(400)
				.json({ message: "At least one field (title or content) is required" });
		}

		const note = await Note.findById(req.params.id);

		if (!note) {
			return res.status(404).json({
				message: "Note not found",
			});
		}

		if (note.owner.toString() !== req.session.userId) {
			return res.status(403).json({
				message: "Unauthorized: You do not own this note",
			});
		}

		if (title) note.title = title;
		if (content) note.content = content;

		const updatedNote = await note.save();

		res.status(200).json(updatedNote);
	} catch (error) {
		res.status(500).json({ message: "Error updating note" });
	}
};

export const deleteNote = async (req, res) => {
	try {
		const note = await Note.findById(req.params.id);

		if (!note) {
			return res.status(404).json({ message: "Note not found" });
		}

		if (note.owner.toString() !== req.session.userId) {
			return res.status(403).json({
				message: "Unauthorized: You do not own this note",
			});
		}

		await note.deleteOne();

		res.status(200).json({ message: "Note deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: "Error deleting note" });
	}
};
