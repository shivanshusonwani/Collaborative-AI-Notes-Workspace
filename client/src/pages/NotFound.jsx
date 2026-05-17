import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Notebook, ArrowLeft, House } from "lucide-react";

const NotFound = () => {
	const { user } = useAuth();

	return (
		<div className='min-h-screen w-screen bg-stone-50 text-stone-800 flex flex-col items-center justify-center px-6 font-sans selection:bg-violet-100 selection:text-violet-900'>
			<div className='w-full max-w-md bg-white border border-stone-200/80 p-8 rounded-2xl shadow-sm shadow-stone-200/40 text-center space-y-5'>
				<div className='p-3 bg-violet-50 text-violet-600 rounded-full w-fit mx-auto border border-violet-100/60 select-none'>
					<Notebook size={24} />
				</div>

				<div className='space-y-1'>
					<h1 className='text-6xl font-black text-violet-600 tracking-tight'>
						404
					</h1>
					<h2 className='text-lg font-bold text-stone-900 tracking-tight'>
						Workspace Not Found
					</h2>
					<p className='text-xs font-medium text-stone-400 max-w-xs mx-auto leading-relaxed'>
						The note link index or routing path parameter you are searching for
						doesn't exist or has been removed.
					</p>
				</div>

				<div className='pt-2'>
					<Link
						to={user ? "/app" : "/"}
						className='inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-xl transition-all shadow-sm outline-none cursor-pointer hover:-translate-y-0.5'>
						{user ? (
							<>
								<House size={14} /> Back to Workspace
							</>
						) : (
							<>
								<ArrowLeft size={14} /> Back to Safety
							</>
						)}
					</Link>
				</div>
			</div>
		</div>
	);
};

export default NotFound;
