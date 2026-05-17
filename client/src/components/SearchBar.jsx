import { Search } from "lucide-react";
import React from "react";

const SearchBar = ({ searchQuery, setSearchQuery }) => {
	return (
		<div className='relative w-full max-w-md my-4'>
			<span className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
				<Search
					size={18}
					className='text-neutral-400'
				/>
			</span>
			<input
				type='text'
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
				placeholder='Search by title, body content, or #tags...'
				className='w-full pl-10 pr-4 py-2 text-sm bg-neutral-100 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all text-neutral-800'
			/>
			{searchQuery && (
				<button
					onClick={() => setSearchQuery("")}
					className='absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-neutral-600 text-xs'>
					Clear
				</button>
			)}
		</div>
	);
};

export default SearchBar;
