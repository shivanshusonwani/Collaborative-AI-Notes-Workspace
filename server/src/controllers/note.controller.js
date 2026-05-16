import Note from "../models/note.model.js";
import User from "../models/user.model.js";
import crypto from "node:crypto";

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
		const notes = await Note.find({
			isArchived: false,
			$or: [
				{ owner: req.session.userId },
				{ collaborators: req.session.userId },
			],
		})
			.populate("owner", "name email")
			.populate("collaborators", "name email")
			.sort({
				updatedAt: -1,
			});
		res.status(200).json(notes);
	} catch (error) {
		res.status(500).json({ message: "Error fetching notes" });
	}
};

export const fetchArchivedNotes = async (req, res) => {
	try {
		const archivedNotes = await Note.find({
			isArchived: true,
			$or: [
				{ owner: req.session.userId },
				{ collaborators: req.session.userId },
			],
		}).sort({ updatedAt: -1 });

		res.status(200).json(archivedNotes);
	} catch (error) {
		res.status(500).json({ message: "Error fetching archived notes" });
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

		const isOwner = note.owner.toString() === req.session.userId;
		const isCollaborator = note.collaborators.includes(req.session.userId);

		if (!isOwner && !isCollaborator) {
			return res
				.status(403)
				.json({ message: "Forbidden: Unauthorized modification access" });
		}

		if (title) note.title = title;
		if (content) note.content = content;

		const updatedNote = await note.save();

		res.status(200).json(updatedNote);
	} catch (error) {
		res.status(500).json({ message: "Error updating note" });
	}
};

export const toggleArchive = async (req, res) => {
	try {
		const note = await Note.findById(req.params.id);

		if (!note) return res.status(404).json({ message: "Note not found" });
		if (note.owner.toString() !== req.session.userId) {
			return res.status(403).json({ message: "Unauthorized resource action" });
		}

		note.isArchived = !note.isArchived;
		await note.save();

		res.status(200).json({
			message: note.isArchived
				? "Note archived cleanly"
				: "Note restored to workspace",
			note,
		});
	} catch (error) {
		res.status(500).json({ message: "Error updating archival status" });
	}
};

export const togglePublicShare = async (req, res) => {
	try {
		const note = await Note.findById(req.params.id);

		if (!note) return res.status(404).json({ message: "Note not found" });
		if (note.owner.toString() !== req.session.userId) {
			return res.status(403).json({ message: "Unauthorized resource action" });
		}

		note.isPublic = !note.isPublic;

		if (note.isPublic) {
			note.publicShareId = crypto.randomBytes(12).toString("hex");
		} else {
			note.publicShareId = undefined;
		}

		await note.save();
		res.status(200).json({
			message: note.isPublic
				? "Public access link enabled"
				: "Public sharing revoked",
			isPublic: note.isPublic,
			shareUrl: note.isPublic ? `/api/notes/share/${note.publicShareId}` : null,
		});
	} catch (error) {
		res.status(500).json({ message: "Error handling sharing configuration" });
	}
};

export const getSharedNote = async (req, res) => {
	try {
		const note = await Note.findOne({ publicShareId: req.params.shareId });

		if (!note || !note.isPublic) {
			return res
				.status(404)
				.json({ message: "Shared note not found or access expired" });
		}

		res.status(200).json({
			title: note.title,
			content: note.content,
			updatedAt: note.updatedAt,
		});
	} catch (error) {
		res.status(500).json({ message: "Error fetching shared note asset" });
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

export const addCollaborator = async (req, res) => {
	try {
		const { email } = req.body;
		const note = await Note.findById(req.params.id);

		if (!note)
			return res.status(404).json({ message: "Note resource not found" });

		if (note.owner.toString() !== req.session.userId) {
			return res.status(403).json({
				message: "Only the author document owner can add collaborators",
			});
		}

		const userToInvite = await User.findOne({
			email: email.toLowerCase().trim(),
		});
		if (!userToInvite) {
			return res.status(404).json({
				message: "No registered user account found with that email address",
			});
		}

		if (userToInvite._id.toString() === req.session.userId) {
			return res
				.status(400)
				.json({ message: "You are already the host document author owner" });
		}

		if (note.collaborators.includes(userToInvite._id)) {
			return res
				.status(400)
				.json({ message: "User is already listed as an invited collaborator" });
		}

		note.collaborators.push(userToInvite._id);
		await note.save();

		res.status(200).json({
			message: "Collaborator appended successfully!",
			collaborators: note.collaborators,
		});
	} catch (error) {
		res.status(500).json({ message: "Internal workspace modification error" });
	}
};

export const removeCollaborator = async (req, res) => {
	try {
		const { id, collaboratorId } = req.params;

		const note = await Note.findById(id);
		if (!note) {
			return res.status(404).json({ message: "Note resource not found" });
		}

		if (note.owner.toString() !== req.session.userId) {
			return res.status(403).json({
				message:
					"Forbidden: Only the document owner can manage collaborator privileges",
			});
		}

		if (!note.collaborators.includes(collaboratorId)) {
			return res
				.status(400)
				.json({ message: "User is not a collaborator on this note" });
		}

		note.collaborators.pull(collaboratorId);
		await note.save();

		const updatedNote = await Note.findById(id)
			.populate("owner", "name email")
			.populate("collaborators", "name email");

		res.status(200).json({
			message: "Collaborator privileges revoked successfully",
			note: updatedNote,
		});
	} catch (error) {
		res
			.status(500)
			.json({ message: "Internal server collaborator removal error" });
	}
};
