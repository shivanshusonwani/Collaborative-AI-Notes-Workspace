import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Notebook, AlertTriangle, ArrowLeft } from "lucide-react";
import axios from "axios";

const SharedNoteViewer = () => {
	const { shareId } = useParams();
	const [note, setNote] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchSharedNote = async () => {
			try {
				setLoading(true);
				const res = await axios.get(
					`${import.meta.env.VITE_API_URL}/api/notes/share/${shareId}`,
				);
				setNote(res.data);
			} catch (err) {
				setError(
					err.response?.data?.message ||
						"Could not retrieve shared document notes.",
				);
			} finally {
				setLoading(false);
			}
		};
		fetchSharedNote();
	}, [shareId]);

	if (loading)
		return (
			<div className='min-h-screen bg-stone-50 flex items-center justify-center text-stone-500 font-medium'>
				Loading unauthenticated public document...
			</div>
		);

	if (error)
		return (
			<div className='min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6 text-center'>
				<AlertTriangle className='text-amber-500 w-12 h-12 mb-4' />
				<h1 className='text-xl font-bold text-stone-900 mb-2'>Access Denied</h1>
				<p className='text-stone-500 max-w-md mb-6'>{error}</p>
				<Link
					to='/'
					className='text-violet-600 inline-flex items-center gap-1 font-semibold hover:underline text-sm'>
					<ArrowLeft size={16} /> Go to CoLab Home
				</Link>
			</div>
		);

	return (
		<div className='min-h-screen bg-stone-50 text-stone-900 selection:bg-violet-100'>
			<header className='h-16 bg-white/80 backdrop-blur-md border-b border-stone-200/80 sticky top-0 flex items-center justify-between px-6 z-10'>
				<div className='flex items-center gap-2 font-bold text-stone-900 text-sm tracking-wide'>
					<Notebook
						size={18}
						className='text-violet-600'
					/>
					<span>COLAB NOTES // PUBLIC VIEW</span>
				</div>
				<Link
					to='/signup'
					className='bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl font-semibold text-xs transition-all shadow-sm'>
					Create Your Workspace
				</Link>
			</header>

			<main className='max-w-3xl mx-auto px-6 py-12'>
				<h1 className='text-4xl font-extrabold tracking-tight text-stone-900 mb-4'>
					{note?.title || "Untitled Document"}
				</h1>
				<div className='text-xs font-semibold text-stone-400 mb-8 tracking-wider uppercase'>
					Last Updated {new Date(note?.updatedAt).toLocaleDateString()}
				</div>
				<article className='prose text-stone-700 whitespace-pre-wrap wrap-break-words leading-relaxed text-base bg-white p-8 rounded-2xl border border-stone-200 shadow-sm'>
					{note?.content || (
						<span className='text-stone-400 italic'>
							This public document contains no content.
						</span>
					)}
				</article>
			</main>
		</div>
	);
};

export default SharedNoteViewer;
