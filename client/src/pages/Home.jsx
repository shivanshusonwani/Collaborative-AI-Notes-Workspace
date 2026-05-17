import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, Notebook } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Home = () => {
	const { user, loading } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!loading && user) {
			navigate("/app");
		}
	}, [user, loading, navigate]);

	if (loading) {
		return (
			<div className='flex h-full w-full items-center justify-center bg-neutral-50'>
				<div className='flex items-center gap-2'>
					<Notebook className='w-4 h-4 text-violet-600 animate-pulse' />
					<p className='text-xs font-medium tracking-wider text-neutral-400 uppercase'>
						Loading...
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className='h-full bg-neutral-50 text-neutral-800 flex flex-col font-sans selection:bg-violet-100 selection:text-violet-900'>
			<main className='flex-1 flex flex-col justify-center max-w-2xl mx-auto px-6 pb-24 w-full'>
				<div className='inline-flex items-center gap-1.5 text-violet-600 mb-4 select-none'>
					<Sparkles size={14} />
					<span className='text-xs font-bold uppercase tracking-wider'>
						AI Workspace Platform
					</span>
				</div>

				<div className='space-y-3'>
					<h1 className='text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 leading-tight'>
						Collaborative AI Notes Workspace
					</h1>
					<p className='text-neutral-500 text-sm sm:text-base font-normal leading-relaxed'>
						A clean place to capture ideas, share live note canvases with team
						collaborators, and generate instantaneous summaries utilizing
						built-in context models.
					</p>
				</div>

				<div className='mt-8'>
					<Link
						to='/signup'
						className='inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-xl px-5 py-3 transition-all cursor-pointer shadow-sm'>
						Get Started Free
						<ArrowRight size={16} />
					</Link>
				</div>
			</main>
		</div>
	);
};

export default Home;
