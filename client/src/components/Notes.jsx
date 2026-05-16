import React, { useState } from "react";
import { useNotes } from "../context/NoteContext";
import { FileText, Clock, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Notes = () => {
	const { notes, setSelectedNote } = useNotes();
	const navigate = useNavigate();

	const formatCardDate = (isoString) => {
		const date = new Date(isoString);
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	const handleNoteClick = (note) => {
		setSelectedNote(note);
		navigate(`/app/note/${note._id}`);
	};

	return (
		<div className='h-full p-4 flex flex-col max-w-6xl mx-auto overflow-y-auto'>
			{notes.length === 0 ? (
				<div className='h-full flex flex-col gap-5 items-center justify-center p-12 bg-white rounded-3xl border border-neutral-200/60 shadow-sm'>
					<div className='p-4 bg-violet-50 text-violet-500 rounded-2xl'>
						<FileText size={48} />
					</div>
					<div className='text-center space-y-2 max-w-sm'>
						<h2 className='text-2xl font-bold text-neutral-800'>
							Your workspace is empty
						</h2>
						<p className='text-neutral-500 text-sm leading-relaxed'>
							Type ideas first via a clean form popup sheet.
						</p>
					</div>

					<button
						onClick={() => navigate("/app/new")}
						className='flex items-center gap-2 px-5 py-3 rounded-xl bg-violet-600 text-white font-bold cursor-pointer shadow-sm'>
						<Plus size={18} /> Create First Note
					</button>
				</div>
			) : (
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
					{notes.map((note) => (
						<div
							key={note._id}
							onClick={() => handleNoteClick(note)}
							className='group bg-white p-6 rounded-2xl border border-neutral-200 cursor-pointer flex flex-col justify-between h-64'>
							<div className='space-y-2 flex-1 min-w-0 w-full'>
								<h3 className='font-bold text-neutral-800 text-base group-hover:text-violet-600 transition-colors truncate w-full'>
									{note.title || "Untitled Document Card"}
								</h3>
								<p className='text-neutral-500 text-sm line-clamp-4 leading-relaxed whitespace-pre-wrap break-all'>
									{note.content ||
										"No content written in this file canvas yet..."}
								</p>
							</div>
							<div className='pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-neutral-400'>
								<span className='flex items-center gap-1.5 bg-neutral-50 px-2.5 py-1 rounded-lg border border-neutral-100'>
									<Clock size={12} /> {formatCardDate(note.updatedAt)}
								</span>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default Notes;
