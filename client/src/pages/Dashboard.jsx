import React, { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Notes from "../components/Notes";
import { Outlet } from "react-router-dom";
import { useNotes } from "../context/NoteContext";

const Dashboard = () => {
	const { notes, fetchNotes, selectedNote, setSelectedNote } = useNotes();

	useEffect(() => {
		const loadWorkspaceData = async () => {
			const fetchedData = await fetchNotes();

			if (fetchedData && fetchedData.length > 0 && !selectedNote) {
				const sorted = [...fetchedData].sort(
					(a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
				);
				setSelectedNote(sorted[0]);
			}
		};

		loadWorkspaceData();
	}, []);

	return (
		<>
			<div className='flex h-full'>
				<div className='min-w-80 border-r border-neutral-200'>
					<Sidebar />
				</div>
				<div className='w-full p-6 bg-neutral-50'>
					<Outlet />
				</div>
			</div>
		</>
	);
};

export default Dashboard;
