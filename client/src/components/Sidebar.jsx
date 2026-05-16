import React from "react";
import { Plus, House, Archive, Lightbulb, Search } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
	const { user } = useAuth();

	const userName = user?.name || "Guest";
	const userInitial = userName.charAt(0).toUpperCase();

	return (
		<div>
			<div className='flex flex-col p-6 gap-4'>
				<div className='flex gap-2 items-center mb-4'>
					<p className='flex justify-center items-center font-bold size-10 bg-violet-500 text-white rounded-full'>
						{userInitial}
					</p>
					<h1 className='text-xl font-semibold'>{userName}</h1>
				</div>

				<button className='flex items-center justify-center gap-1 w-full text-lg bg-violet-500 text-white font-semibold p-2 rounded-xl cursor-pointer'>
					<Plus size={"22"} /> new note
				</button>

				<div className='flex flex-col gap-2'>
					<div className='flex items-center gap-2 px-4 py-2 bg-violet-100 text-violet-600 font-semibold rounded-lg'>
						<House size={"18"} />
						<h2 className=''>All Note</h2>
					</div>
					<div className='flex items-center gap-2 px-4 py-2 rounded-lg'>
						<Archive size={"18"} />
						<h2 className=''>Archived</h2>
					</div>
					<div className='flex items-center gap-2 px-4 py-2 rounded-lg'>
						<Lightbulb size={"18"} />
						<h2 className=''>Insight</h2>
					</div>
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

				<div className='flex flex-col gap-2'>
					<div className='border border-neutral-200 px-4 py-2 rounded-xl'>
						<h1>Note 1</h1>
					</div>
					<div className='border border-neutral-200 px-4 py-2 rounded-xl'>
						<h1>Note 2</h1>
					</div>
					<div className='border border-neutral-200 px-4 py-2 rounded-xl'>
						<h1>Note 3</h1>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Sidebar;
