import React, { useState, useEffect, useRef } from "react";
import { useNotes } from "../context/NoteContext";
import { useLocation, useNavigate } from "react-router-dom";
import {
	Clock,
	MoreVertical,
	Archive,
	RotateCcw,
	Globe,
	Lock,
	Trash2,
	ExternalLink,
} from "lucide-react";

const Notes = () => {
	const {
		notes,
		fetchNotes,
		loadingNotes,
		deleteNote,
		setSelectedNote,
		saveNoteChanges,
		toggleArchiveNote,
		toggleShareNote,
	} = useNotes();
	const navigate = useNavigate();

	const location = useLocation();
	const isArchivedTab = location.pathname.includes("archived");

	const [activeMenuId, setActiveMenuId] = useState(null);
	const dropdownRef = useRef(null);

	const BACKEND_URL = "http://localhost:8080";

	const formatCardDate = (isoString) => {
		if (!isoString) return "";
		const date = new Date(isoString);
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	const handleNoteClick = (note) => {
		if (typeof setSelectedNote === "function") {
			setSelectedNote(note);
		}
		navigate(`/app/note/${note._id}`);
	};

	const handleMenuToggle = (e, noteId) => {
		e.stopPropagation();
		setActiveMenuId(activeMenuId === noteId ? null : noteId);
	};

	const handleCopyLink = (e, shareId) => {
		e.stopPropagation();
		const apiSharedUrl = `${BACKEND_URL}/api/notes/share/${shareId}`;
		navigator.clipboard.writeText(apiSharedUrl);
		alert("Backend shareable API link copied to clipboard!");
		setActiveMenuId(null);
	};

	const handleToggleArchive = async (e, note) => {
		e.stopPropagation();
		if (typeof saveNoteChanges === "function") {
			await saveNoteChanges(note._id, { isArchived: !note.isArchived });
		} else {
			alert(
				"saveNoteChanges function is missing from NoteContext configuration!",
			);
		}
		setActiveMenuId(null);
	};

	const handleTogglePublic = async (e, note) => {
		e.stopPropagation();
		if (typeof saveNoteChanges === "function") {
			const NextPublicState = !note.isPublic;
			const updatePayload = {
				isPublic: NextPublicState,
				publicShareId: NextPublicState
					? note.publicShareId || Math.random().toString(36).substring(2, 14)
					: null,
			};
			await saveNoteChanges(note._id, updatePayload);
		} else {
			alert(
				"saveNoteChanges function is missing from NoteContext configuration!",
			);
		}
		setActiveMenuId(null);
	};

	useEffect(() => {
		const handleOutsideClick = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setActiveMenuId(null);
			}
		};
		document.addEventListener("mousedown", handleOutsideClick);
		return () => document.removeEventListener("mousedown", handleOutsideClick);
	}, []);

	useEffect(() => {
		fetchNotes(isArchivedTab);
		setActiveMenuId(null);
	}, [isArchivedTab]);

	if (loadingNotes)
		return (
			<div className='p-6 text-neutral-500'>
				Loading your workspace folders...
			</div>
		);

	return (
		<div className='h-full p-4 flex flex-col max-w-6xl mx-auto overflow-y-auto'>
			<h2 className='text-2xl font-bold mb-6 text-neutral-800'>
				Your Notes Workspace
			</h2>

			{notes.length === 0 ? (
				<div className='text-center p-12 border-2 border-dashed border-neutral-200 rounded-2xl'>
					<p className='text-neutral-500 italic'>
						No active cards found inside this dashboard grid frame.
					</p>
				</div>
			) : (
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
					{notes.map((note) => {
						const isPublic = note.isPublic;
						const menuOpen = activeMenuId === note._id;

						return (
							<div
								key={note._id}
								onClick={() => handleNoteClick(note)}
								className='group bg-white p-6 rounded-2xl border border-neutral-200 cursor-pointer flex flex-col justify-between min-h-64 hover:shadow-md hover:border-neutral-300 transition-all relative'>
								<div className='space-y-2 flex-1 min-w-0 w-full'>
									<div className='flex justify-between items-start gap-4 relative'>
										<h3 className='font-bold text-neutral-800 text-base group-hover:text-violet-600 transition-colors truncate w-full pr-6'>
											{note.title || "Untitled Document"}
										</h3>

										<div
											className='absolute right-0 top-0'
											ref={menuOpen ? dropdownRef : null}>
											<button
												onClick={(e) => handleMenuToggle(e, note._id)}
												className='p-1 text-neutral-400 hover:text-neutral-600 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer'
												title='Open context panel operations'>
												<MoreVertical size={18} />
											</button>

											{menuOpen && (
												<div
													onClick={(e) => e.stopPropagation()}
													className='absolute right-0 mt-1 w-42 bg-white border border-neutral-200 rounded-xl shadow-xl py-1.5 z-50 text-sm font-medium'>
													<button
														onClick={async (e) => {
															e.stopPropagation();
															await toggleArchiveNote(note._id);
															setActiveMenuId(null);
														}}
														className='w-full px-4 py-2 text-left text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 transition-colors cursor-pointer'>
														{note.isArchived ? (
															<>
																<RotateCcw
																	size={14}
																	className='text-emerald-500'
																/>{" "}
																Send to Active
															</>
														) : (
															<>
																<Archive
																	size={14}
																	className='text-neutral-400'
																/>{" "}
																Mark Archive
															</>
														)}
													</button>

													<button
														onClick={async (e) => {
															e.stopPropagation();
															await toggleShareNote(note._id);
															setActiveMenuId(null);
														}}
														className='w-full px-4 py-2 text-left text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 transition-colors cursor-pointer'>
														{isPublic ? (
															<>
																<Lock
																	size={14}
																	className='text-amber-500'
																/>{" "}
																Make Private
															</>
														) : (
															<>
																<Globe
																	size={14}
																	className='text-emerald-500'
																/>{" "}
																Make Public
															</>
														)}
													</button>

													<div className='border-t border-neutral-100 my-1'></div>

													<button
														onClick={(e) => {
															e.stopPropagation();
															if (
																window.confirm(
																	"Are you sure you want to permanently purge this note?",
																)
															) {
																deleteNote(note._id);
															}
															setActiveMenuId(null);
														}}
														className='w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors cursor-pointer font-semibold'>
														<Trash2 size={14} /> Delete note
													</button>
												</div>
											)}
										</div>
									</div>

									<p className='text-neutral-500 text-sm line-clamp-4 leading-relaxed whitespace-pre-wrap break-all pt-1'>
										{note.content || "Empty content canvas..."}
									</p>
								</div>

								<div className='pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between gap-2'>
									<span className='flex items-center gap-1 text-neutral-400 text-xs'>
										<Clock size={12} /> {formatCardDate(note.updatedAt)}
									</span>

									{isPublic && note.publicShareId && (
										<div
											className='flex items-center gap-1.5'
											onClick={(e) => e.stopPropagation()}>
											<button
												onClick={(e) => handleCopyLink(e, note.publicShareId)}
												className='p-1.5 text-violet-600 hover:text-violet-700 hover:bg-violet-50 rounded-lg border border-violet-100 transition-colors flex items-center cursor-pointer'
												title='Copy direct shareable link'>
												<ExternalLink size={14} />
											</button>
										</div>
									)}
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default Notes;
