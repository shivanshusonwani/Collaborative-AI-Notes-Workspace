import React from "react";
import { Plus, House, Archive, Lightbulb, Search } from "lucide-react";
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

	const navLinkClass = ({ isActive }) =>
		`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-semibold cursor-pointer ${
			isActive
				? "bg-violet-100 text-violet-600"
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

			<div className='flex flex-col gap-2'>
				<button
					onClick={handleCreateNote}
					className='flex items-center justify-center gap-1 w-full text-lg bg-violet-500 text-white font-semibold p-2 rounded-xl cursor-pointer'>
					<Plus size={"22"} /> new note
				</button>

				<div className='flex flex-col gap-2 border border-violet-200 rounded-lg'>
					<NavLink
						to='/app'
						end
						className={navLinkClass}>
						<House size={"18"} />
						<h2 className=''>All Note</h2>
					</NavLink>

					<NavLink
						// to='/app/archived'
						className='flex items-center gap-2 px-4 py-2 rounded-lg'>
						<Archive size={"18"} />
						<h2 className=''>Archived</h2>
					</NavLink>

					<NavLink
						// to='/app/insights'
						className='flex items-center gap-2 px-4 py-2 rounded-lg'>
						<Lightbulb size={"18"} />
						<h2 className=''>Insight</h2>
					</NavLink>
				</div>
				<div className='flex items-center gap-2 bg-neutral-100 rounded-lg px-4 py-2'>
					<Search
						size={"18"}
						className='text-neutral-400'
					/>
					<input
						type='text'
						placeholder='Search notes...'
						className='w-full outline-none placeholder:text-neutral-400'
					/>
				</div>
			</div>

			<div className='h-full overflow-y-auto scrollbar-thin'>
				<div className='flex flex-col gap-2 pr-1 py-2'>
					{notes.length === 0 ? (
						<p className='text-xs text-neutral-400 italic text-center mt-4'>
							No notes created yet
						</p>
					) : null}
				</div>
			</div>
		</div>
	);
};

export default Sidebar;
