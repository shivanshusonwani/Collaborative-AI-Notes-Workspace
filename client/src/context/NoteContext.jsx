import { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api";
import { useAuth } from "./AuthContext";

const NoteContext = createContext();

export const NoteProvider = ({ children }) => {
	const [notes, setNotes] = useState([]);
	const [selectedNote, setSelectedNote] = useState(null);
	const [loadingNotes, setLoadingNotes] = useState(false);

	const { user } = useAuth();

	const fetchNotes = async () => {
		if (!user) {
			setNotes([]);
			setSelectedNote(null);
			return;
		}

		setLoadingNotes(true);

		try {
			const res = await API.get("/notes");
			setNotes(res.data);

			if (res.data.length > 0) {
				setSelectedNote(res.data[0]);
			}
		} catch (error) {
			console.error("Error fetching notes from backend:", error);
		} finally {
			setLoadingNotes(false);
		}
	};

	useEffect(() => {
		fetchNotes();
	}, [user]);

	const createNote = async () => {
		try {
			const res = await API.post("/notes", {
				title: "Untitled Note",
				content: "",
			});

			setNotes((prevNotes) => [res.data, ...prevNotes]);

			setSelectedNote(res.data);

			return res.data;
		} catch (error) {
			console.error("Failed to create new note document:", error);
		}
	};

	const saveNoteChanges = async (id, updatedFields) => {
		try {
			const res = await API.patch(`/notes/${id}`, updatedFields);

			setNotes((prevNotes) =>
				prevNotes.map((note) => (note._id === id ? res.data : note)),
			);

			setSelectedNote(res.data);

			return {
				success: true,
				note: res.data,
			};
		} catch (error) {
			console.error("Failed to save note:", error);

			return {
				success: false,
				error,
			};
		}
	};

	return (
		<NoteContext.Provider
			value={{
				notes,
				fetchNotes,
				selectedNote,
				setSelectedNote,
				createNote,
				saveNoteChanges,
				loadingNotes,
			}}>
			{children}
		</NoteContext.Provider>
	);
};

export const useNotes = () => useContext(NoteContext);
