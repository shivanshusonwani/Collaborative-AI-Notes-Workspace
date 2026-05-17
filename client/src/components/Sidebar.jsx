import React from "react";
import {
	Plus,
	House,
	Archive,
	Lightbulb,
	Search,
	BarChart2,
	FileText,
	Sparkles,
	Tag,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNotes } from "../context/NoteContext";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
	const { user } = useAuth();
	const { notes, createNote, selectedNote, setSelectedNote } = useNotes();

	const navigate = useNavigate();

	const userName = user?.name || "Guest";
	const userInitial = userName.charAt(0).toUpperCase();

	const handleCreateNote = async () => {
		const newNote = await createNote();

		if (newNote) {
			navigate("/app/new");
		}
	};

	const totalNotesCount = notes.length;

	const tagCounts = notes
		.filter((note) => !note.isArchived)
		.flatMap((note) => note.tags || [])
		.reduce((acc, tag) => {
			if (tag) {
				const normalizedTag = tag.trim();
				acc[normalizedTag] = (acc[normalizedTag] || 0) + 1;
			}
			return acc;
		}, {});

	const topFiveTags = Object.entries(tagCounts)
		.map(([name, count]) => ({ name, count }))
		.sort((a, b) => b.count - a.count)
		.slice(0, 5);

	const navLinkClass = ({ isActive }) =>
		`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors font-semibold cursor-pointer ${
			isActive
				? "bg-violet-50 text-violet-600"
				: "text-neutral-600 hover:bg-neutral-100"
		}`;

	return (
		<div className='h-full flex flex-col p-6 gap-4'>
			<div className='flex gap-2 items-center'>
				<p className='flex justify-center items-center font-bold size-10 bg-violet-500 text-white rounded-full'>
					{userInitial}
				</p>
				<h1 className='text-xl font-semibold'>{userName}</h1>
			</div>

			<div className='flex flex-col gap-4'>
				<button
					onClick={handleCreateNote}
					className='flex items-center justify-center gap-1 w-full text-lg bg-violet-500 text-white font-semibold p-2 rounded-xl cursor-pointer'>
					<Plus size={"22"} /> new note
				</button>

				<div className='flex flex-col rounded-lg'>
					<NavLink
						to='/app'
						end
						className={navLinkClass}>
						<House size={"18"} />
						<h2 className=''>All Note</h2>
					</NavLink>

					<NavLink
						to='/app/archived'
						className={navLinkClass}>
						<Archive size={"18"} />
						<h2 className=''>Archived</h2>
					</NavLink>
				</div>

				<div className='mt-auto border-t border-neutral-100 bg-violet-50/50 rounded-xl p-3.5'>
					<div className='flex items-center gap-1.5 font-bold text-neutral-600 uppercase tracking-wider mb-2.5'>
						<BarChart2
							size={"14"}
							className='text-emerald-500'
						/>
						<span>Insights</span>
					</div>

					<div className='flex flex-col gap-2.5'>
						<div className='flex justify-between items-center text-sm text-neutral-600'>
							<div className='flex items-center gap-1.5'>
								<FileText
									size={"14"}
									className='text-neutral-400'
								/>
								<span>Total Notes</span>
							</div>
							<span className='font-bold text-neutral-800 bg-white px-2 py-0.5 rounded border border-neutral-200 shadow-2xs'>
								{totalNotesCount}
							</span>
						</div>

						<div className='flex flex-col gap-1.5 border-y border-neutral-100/70 py-2'>
							<div className='flex items-center gap-1.5 text-sm font-bold text-neutral-400 uppercase tracking-wider'>
								<Tag size={"12"} />
								<span>Top Tags</span>
							</div>

							{topFiveTags.length === 0 ? (
								<span className='text-sm text-neutral-400 italic pt-0.5'>
									No tags used yet
								</span>
							) : (
								<div className='flex flex-col gap-1 pt-0.5'>
									{topFiveTags.map((tag) => (
										<div
											key={tag.name}
											className='flex items-center justify-between text-sm font-medium text-neutral-600 bg-white hover:bg-neutral-100/50 px-2 py-1.5 rounded-md border border-neutral-200/50 transition-colors'>
											<span className='truncate max-w-35'>#{tag.name}</span>
											<span className='text-[10px] bg-neutral-100 text-neutral-700 font-bold px-1.5 py-0.5 rounded-full border border-neutral-200/30'>
												{tag.count}
											</span>
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Sidebar;
