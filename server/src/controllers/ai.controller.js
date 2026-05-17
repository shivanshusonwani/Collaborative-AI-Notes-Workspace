import { GoogleGenAI } from "@google/genai";
import Note from "../models/note.model.js";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateNoteInsights = async (req, res) => {
	try {
		const { id } = req.params;
		const userId = req.session.userId;

		const note = await Note.findOne({ _id: id, owner: userId });

		if (!note) {
			return res
				.status(404)
				.json({ message: "Note not found or access denied." });
		}

		if (!note.content || note.content.trim() === "") {
			return res.status(400).json({
				message: "Cannot optimize an empty note. Please type something first!",
			});
		}

		const response = await ai.models.generateContent({
			model: "gemini-2.5-flash",
			contents: `Please refine, optimize, and professionally format the following note text while retaining its core details:\n\n${note.content}`,
			config: {
				systemInstruction:
					"You are an elite note-taking editor. Rewrite the user's notes to be clear, professional, well-structured, and easy to read. Fix any grammatical issues. Do not write introductory chatter like 'Here is your text'—simply output the optimized note content directly.",
			},
		});

		const optimizedText = response.text;

		return res.status(200).json({
			message: "Note optimized successfully!",
			optimizedText: optimizedText,
		});
	} catch (error) {
		console.error("Gemini Optimization Processing Failure:", error);
		return res.status(500).json({
			message: "Internal server error during AI generation processing.",
		});
	}
};
