import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNotes } from "../context/NoteContext";
import { useNavigate, useLocation } from "react-router-dom";
import {
	Clock,
	MoreVertical,
	Archive,
	RotateCcw,
	Globe,
	Lock,
	Trash2,
	ExternalLink,
	Users,
	UserPlus,
	X,
	XCircle,
	Tag,
	Hash,
} from "lucide-react";
import SearchBar from "./SearchBar";

const Notes = () => {
	const {
		notes,
		loadingNotes,
		deleteNote,
		setSelectedNote,
		toggleArchiveNote,
		toggleShareNote,
		fetchNotes,
		addCollaborator,
		removeCollaborator,
	} = useNotes();

	const navigate = useNavigate();
	const location = useLocation();
	const isArchivedTab = location.pathname.includes("archived");

	const [activeMenuId, setActiveMenuId] = useState(null);
	const [colabModalNote, setColabModalNote] = useState(null);
	const [colabEmail, setColabEmail] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [activeTag, setActiveTag] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const dropdownRef = useRef(null);

	useEffect(() => {
		fetchNotes(isArchivedTab);
		setActiveMenuId(null);
		setActiveTag("");
	}, [isArchivedTab, fetchNotes]);

	useEffect(() => {
		if (colabModalNote) {
			const currentLiveNote = notes.find((n) => n._id === colabModalNote._id);
			if (currentLiveNote) {
				setColabModalNote(currentLiveNote);
			}
		}
	}, [notes, colabModalNote?._id]);

	const uniqueTags = useMemo(() => {
		const tagsSet = new Set();
		notes.forEach((note) => {
			if (Array.isArray(note.tags)) {
				note.tags.forEach((t) => {
					if (t) tagsSet.add(t);
				});
			}
		});
		return Array.from(tagsSet);
	}, [notes]);

	const filteredNotes = useMemo(() => {
		return notes.filter((note) => {
			if (activeTag && (!note.tags || !note.tags.includes(activeTag))) {
				return false;
			}

			const query = searchQuery.toLowerCase().trim();
			if (!query) return true;

			const matchTitle = note.title?.toLowerCase().includes(query);
			const matchContent = note.content?.toLowerCase().includes(query);
			const matchTags = note.tags?.some((tag) =>
				tag.toLowerCase().replace("#", "").includes(query.replace("#", "")),
			);

			return matchTitle || matchContent || matchTags;
		});
	}, [notes, searchQuery, activeTag]);

	useEffect(() => {
		const handleOutsideClick = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setActiveMenuId(null);
			}
		};
		document.addEventListener("mousedown", handleOutsideClick);
		return () => document.removeEventListener("mousedown", handleOutsideClick);
	}, []);

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
		setSelectedNote(note);
		navigate(`/app/note/${note._id}`);
	};

	const handleMenuToggle = (e, noteId) => {
		e.stopPropagation();
		setActiveMenuId(activeMenuId === noteId ? null : noteId);
	};

	const handleCopyLink = (e, shareId) => {
		e.stopPropagation();
		const apiSharedUrl = `${window.location.origin}/notes/share/${shareId}`;
		navigator.clipboard.writeText(apiSharedUrl);
		alert("Shareable link copied to clipboard!");
		setActiveMenuId(null);
	};

	const handleInviteCollaborator = async (e) => {
		e.preventDefault();
		if (!colabEmail.trim() || !colabModalNote) return;

		setIsSubmitting(true);
		const result = await addCollaborator(colabModalNote._id, colabEmail.trim());
		setIsSubmitting(false);

		if (result.success) {
			alert(result.message || "Collaborator added successfully!");
			setColabEmail("");
			if (result.note) {
				setColabModalNote(result.note);
			}
		} else {
			alert(result.message);
		}
	};

	const handleRemoveCollaborator = async (collaboratorId) => {
		if (!window.confirm("Revoke editing privileges for this collaborator?"))
			return;

		const result = await removeCollaborator(colabModalNote._id, collaboratorId);
		if (result.success) {
			if (result.note) {
				setColabModalNote(result.note);
			}
		} else {
			alert(result.message);
		}
	};

	if (loadingNotes)
		return (
			<div className='p-6 text-neutral-500 text-sm font-medium animate-pulse'>
				Loading your workspace cards...
			</div>
		);

	return (
		<div className='h-full p-4 flex flex-col max-w-6xl mx-auto overflow-y-auto relative'>
			<h2 className='text-2xl font-bold mb-4 text-neutral-800 tracking-tight'>
				{isArchivedTab ? "Archived Vault Storage" : "Your Notes Workspace"}
			</h2>

			{/* Global Search Bar Input */}
			<SearchBar
				searchQuery={searchQuery}
				setSearchQuery={setSearchQuery}
			/>

			{/* Filter Pills Header Segment */}
			{!isArchivedTab && uniqueTags.length > 0 && (
				<div className='mb-6 flex flex-wrap items-center gap-2 border-b border-neutral-100 pb-4 mt-2'>
					<span className='text-neutral-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1 mr-2'>
						<Tag size={13} /> Filter by:
					</span>

					<button
						onClick={() => setActiveTag("")}
						className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
							activeTag === ""
								? "bg-violet-600 text-white shadow-sm"
								: "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
						}`}>
						All Notes
					</button>

					{uniqueTags.map((tag) => (
						<button
							key={tag}
							onClick={() => setActiveTag(tag)}
							className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
								activeTag === tag
									? "bg-violet-600 text-white shadow-sm"
									: "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
							}`}>
							<Hash size={11} /> {tag}
						</button>
					))}
				</div>
			)}

			{/* Primary Grid Layout Cards Area */}
			{filteredNotes.length === 0 ? (
				<div className='text-center p-12 border-2 border-dashed border-neutral-200 rounded-2xl bg-white mt-4'>
					<p className='text-neutral-400 text-sm italic'>
						{searchQuery || activeTag
							? `No records match current parameters.`
							: isArchivedTab
								? "No archived note files found."
								: "No active workspace notes found."}
					</p>
				</div>
			) : (
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4'>
					{filteredNotes.map((note) => {
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

										{/* Dropdown Action Target Anchor */}
										<div
											className='absolute right-0 top-0'
											ref={menuOpen ? dropdownRef : null}>
											<button
												onClick={(e) => handleMenuToggle(e, note._id)}
												className='p-1 text-neutral-400 hover:text-neutral-600 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer'>
												<MoreVertical size={18} />
											</button>

											{menuOpen && (
												<div
													onClick={(e) => e.stopPropagation()}
													className='absolute right-0 mt-1 w-48 bg-white border border-neutral-200 rounded-xl shadow-xl py-1.5 z-50 text-sm font-medium'>
													<button
														onClick={(e) => {
															e.stopPropagation();
															setColabModalNote(note);
															setActiveMenuId(null);
														}}
														className='w-full px-4 py-2 text-left text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 transition-colors cursor-pointer'>
														<Users
															size={14}
															className='text-neutral-400'
														/>
														Collaborators
													</button>

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
																	className='text-violet-500'
																/>
																Send to Active
															</>
														) : (
															<>
																<Archive
																	size={14}
																	className='text-neutral-400'
																/>
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
																/>
																Make Private
															</>
														) : (
															<>
																<Globe
																	size={14}
																	className='text-emerald-500'
																/>
																Make Public
															</>
														)}
													</button>

													<div className='border-t border-neutral-100 my-1'></div>

													<button
														onClick={async (e) => {
															e.stopPropagation();
															if (
																window.confirm(
																	"Are you sure you want to permanently delete this note?",
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

									{/* Inline Card Tags Rendering row */}
									{note.tags && note.tags.length > 0 && (
										<div
											className='flex flex-wrap gap-1.5 pt-2'
											onClick={(e) => e.stopPropagation()}>
											{note.tags.map((t) => (
												<span
													key={t}
													className={`text-[10px] font-bold px-2 py-0.5 rounded-md transition-colors ${
														activeTag === t
															? "bg-violet-600 text-white"
															: "bg-neutral-100 text-neutral-600 hover:bg-violet-50 hover:text-violet-600"
													}`}
													onClick={() =>
														setActiveTag(activeTag === t ? "" : t)
													}>
													#{t}
												</span>
											))}
										</div>
									)}
								</div>

								<div className='pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between gap-2'>
									<span className='flex items-center gap-1 text-neutral-400 text-xs'>
										<Clock size={12} /> {formatCardDate(note.updatedAt)}
									</span>

									<div
										className='flex items-center gap-1.5'
										onClick={(e) => e.stopPropagation()}>
										{note.collaborators?.length > 0 && (
											<span className='text-[11px] font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md flex items-center gap-1'>
												<Users size={11} /> {note.collaborators.length}
											</span>
										)}

										{isPublic && note.publicShareId && (
											<button
												onClick={(e) => handleCopyLink(e, note.publicShareId)}
												className='p-1.5 text-violet-600 hover:text-violet-700 hover:bg-violet-50 rounded-lg border border-violet-100 transition-colors flex items-center cursor-pointer'
												title='Copy direct link'>
												<ExternalLink size={14} />
											</button>
										)}
									</div>
								</div>
							</div>
						);
					})}
				</div>
			)}

			{/* Access Manager / Collaboration Drawer Modal */}
			{colabModalNote && (
				<div className='fixed inset-0 bg-neutral-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150'>
					<div className='w-full max-w-md bg-white rounded-2xl border border-neutral-200 shadow-2xl flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150'>
						<div className='p-4 border-b border-neutral-100 flex items-center justify-between'>
							<div className='flex items-center gap-2'>
								<Users
									className='text-violet-600'
									size={18}
								/>
								<h3 className='font-bold text-neutral-800 text-lg'>
									Manage Access
								</h3>
							</div>
							<button
								onClick={() => {
									setColabModalNote(null);
									setColabEmail("");
								}}
								className='p-1 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50 rounded-xl transition-colors cursor-pointer'>
								<X size={18} />
							</button>
						</div>

						<div className='p-5 overflow-y-auto space-y-4 flex-1'>
							<div>
								<label className='block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2'>
									Invite via registration email
								</label>
								<form
									onSubmit={handleInviteCollaborator}
									className='flex gap-2'>
									<input
										type='email'
										required
										placeholder='name@example.com'
										value={colabEmail}
										onChange={(e) => setColabEmail(e.target.value)}
										className='flex-1 border border-neutral-200 px-3.5 py-2 rounded-xl text-sm outline-none focus:border-violet-500 transition-colors'
									/>
									<button
										type='submit'
										disabled={isSubmitting}
										className='px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-sm cursor-pointer disabled:bg-neutral-300'>
										<UserPlus size={14} />
										{isSubmitting ? "Inviting..." : "Invite"}
									</button>
								</form>
							</div>

							<div className='space-y-2 pt-2'>
								<label className='block text-xs font-bold uppercase tracking-wider text-neutral-400'>
									Who has active workspace access
								</label>

								<div className='divide-y divide-neutral-50 border border-neutral-100 rounded-xl overflow-hidden bg-neutral-50/50'>
									<div className='p-3 flex items-center justify-between text-sm'>
										<div className='min-w-0 flex-1 pr-4'>
											<p className='font-semibold text-neutral-800 truncate'>
												{colabModalNote.owner?.name || "Author Host"}
												<span className='ml-1.5 text-[10px] font-bold bg-violet-100 text-violet-700 border border-violet-200 px-1.5 py-0.5 rounded'>
													Owner
												</span>
											</p>
											<p className='text-xs text-neutral-400 truncate'>
												{colabModalNote.owner?.email}
											</p>
										</div>
									</div>

									{colabModalNote.collaborators?.length === 0 ? (
										<div className='p-4 text-center text-xs text-neutral-400 italic'>
											No external collaborators have been added to this note
											yet.
										</div>
									) : (
										colabModalNote.collaborators?.map((user) => (
											<div
												key={user._id}
												className='p-3 flex items-center justify-between text-sm hover:bg-neutral-50 transition-colors'>
												<div className='min-w-0 flex-1 pr-4'>
													<p className='font-medium text-neutral-700 truncate'>
														{user.name}
													</p>
													<p className='text-xs text-neutral-400 truncate'>
														{user.email}
													</p>
												</div>
												<button
													onClick={() => handleRemoveCollaborator(user._id)}
													className='text-neutral-400 hover:text-red-500 p-1 rounded-lg hover:bg-red-50 transition-all cursor-pointer'
													title='Revoke access permissions'>
													<XCircle size={15} />
												</button>
											</div>
										))
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Notes;
