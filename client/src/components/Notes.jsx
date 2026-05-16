import React from "react";
import { NotebookPen } from "lucide-react";

const Notes = () => {
	return (
		<div className='h-full flex flex-col gap-4 items-center justify-center'>
			<NotebookPen size={80} />
			<div className='w-72 text-center'>
				<h2 className='text-2xl font-semibold'>No notes yet</h2>
				<p className='text-neutral-500'>
					Create your first note to start capturing ideas with AI assistance
				</p>
			</div>
			<button className='px-4 py-3 rounded-2xl bg-violet-600 text-white cursor-pointer'>
				Create First Note
			</button>
		</div>
	);
};

export default Notes;
