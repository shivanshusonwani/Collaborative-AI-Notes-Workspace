import { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api";
import { useAuth } from "./AuthContext";

const NoteContext = createContext();

export const NoteProvider = ({ children }) => {
	const [notes, setNotes] = useState([]);
	const [selectedNote, setSelectedNote] = useState(null);
	const [loadingNotes, setLoadingNotes] = useState(false);

	const { user } = useAuth();

	const fetchNotes = async (isArchivedView = false) => {
		if (!user) {
			setNotes([]);
			setSelectedNote(null);
			return;
		}

		setLoadingNotes(true);

		try {
			const targetUrl = isArchivedView ? "/notes/archived" : "/notes";
			const res = await API.get(targetUrl);
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

	const deleteNote = async (id) => {
		try {
			await API.delete(`/notes/${id}`);

			setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));

			if (selectedNote?._id === id) {
				setSelectedNote(null);
			}

			return { success: true };
		} catch (error) {
			console.error("Failed to delete note:", error);
			return { success: false, error };
		}
	};

	const toggleArchiveNote = async (id) => {
		try {
			const res = await API.patch(`/notes/${id}/archive`);
			setNotes((prev) => prev.filter((note) => note._id !== id));
			return res.data;
		} catch (error) {
			console.error("Failed to archive note:", error);
			return { success: false, error };
		}
	};

	const toggleShareNote = async (id) => {
		try {
			const res = await API.patch(`/notes/${id}/share-toggle`);
			setNotes((prev) =>
				prev.map((note) =>
					note._id === id
						? {
								...note,
								isPublic: res.data.isPublic,
								publicShareId: res.data.shareUrl?.split("/").pop(),
							}
						: note,
				),
			);
			return res.data;
		} catch (error) {
			console.error("Failed to toggle sharing note status:", error);
			return { success: false, error };
		}
	};

	return (
		<NoteContext.Provider
			value={{
				notes,
				fetchNotes,
				createNote,
				saveNoteChanges,
				deleteNote,
				selectedNote,
				setSelectedNote,
				toggleArchiveNote,
				toggleShareNote,
				loadingNotes,
			}}>
			{children}
		</NoteContext.Provider>
	);
};

export const useNotes = () => useContext(NoteContext);
