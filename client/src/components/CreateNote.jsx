import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNotes } from "../context/NoteContext";
import { Save, CheckCircle, ArrowLeft, X, Hash, Sparkles } from "lucide-react";

const CreateNote = () => {
	const {
		selectedNote,
		setSelectedNote,
		saveNoteChanges,
		fetchOptimizedContent,
	} = useNotes();

	const navigate = useNavigate();

	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [isSaving, setIsSaving] = useState(false);
	const [saveSuccess, setSaveSuccess] = useState(false);

	const [tags, setTags] = useState([]);
	const [tagInput, setTagInput] = useState("");

	const [isAiModalOpen, setIsAiModalOpen] = useState(false);
	const [aiSuggestion, setAiSuggestion] = useState("");
	const [isAiLoading, setIsAiLoading] = useState(false);

	useEffect(() => {
		if (selectedNote) {
			setTitle(selectedNote.title || "");
			setContent(selectedNote.content || "");
			setTags(selectedNote.tags || []);
		} else {
			setTitle("");
			setContent("");
			setTags([]);
		}
		setSaveSuccess(false);
	}, [selectedNote?._id]);

	const handleKeyDown = (e) => {
		if (e.key === "Enter" || e.key === ",") {
			e.preventDefault();
			const cleanedTag = tagInput.trim().toLowerCase().replace(/#/g, "");

			if (cleanedTag && !tags.includes(cleanedTag)) {
				setTags([...tags, cleanedTag]);
				setTagInput("");
			}
		}
	};

	const removeTag = (tagToRemove) => {
		setTags(tags.filter((t) => t !== tagToRemove));
	};

	const handleSave = async () => {
		console.log(selectedNote);
		if (!selectedNote?._id || isSaving) return;

		setIsSaving(true);
		setSaveSuccess(false);

		const result = await saveNoteChanges(selectedNote._id, {
			title: title.trim() || "Untitled Document",
			content,
			tags,
		});

		setIsSaving(false);

		if (result.success) {
			setSaveSuccess(true);
			setTimeout(() => setSaveSuccess(false), 2000);
		}
	};

	const handleBack = () => {
		setSelectedNote(null);
		navigate("/app");
	};

	const handleOptimizeClick = async () => {
		if (!content || !content.trim()) {
			alert(
				"Please capture some thoughts first before requesting optimization!",
			);
			return;
		}

		setIsAiLoading(true);
		const optimizedText = await fetchOptimizedContent(
			selectedNote?._id,
			content,
		);
		setIsAiLoading(false);

		if (optimizedText) {
			setAiSuggestion(optimizedText);
			setIsAiModalOpen(true);
		}
	};

	const handleReplaceContent = () => {
		setContent(aiSuggestion);
		setIsAiModalOpen(false);
		setAiSuggestion("");
	};

	return (
		<div className='lg:col-span-2 flex flex-col gap-4 bg-white p-6 rounded-2xl shadow-sm border border-neutral-200/60 h-full relative'>
			<div className='flex items-center justify-between border-b border-neutral-100 pb-4 '>
				<button
					onClick={handleBack}
					className='p-2 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer text-neutral-500 mr-2'>
					<ArrowLeft size={18} />
				</button>
				<input
					type='text'
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					className='text-2xl font-extrabold border-none outline-none text-neutral-800 w-full placeholder:text-neutral-300 tracking-tight'
					placeholder='Untitled Document'
				/>
				<div className='flex items-center gap-2'>
					{saveSuccess && (
						<span className='text-emerald-600 text-xs font-semibold flex items-center gap-1 whitespace-nowrap'>
							<CheckCircle size={14} /> Synced!
						</span>
					)}

					<button
						onClick={handleOptimizeClick}
						disabled={isAiLoading || isSaving || !content?.trim()}
						className='flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 disabled:bg-neutral-100 disabled:text-neutral-400 shadow-xs transition-all cursor-pointer border border-purple-200/30'>
						<Sparkles
							size={14}
							className={isAiLoading ? "animate-pulse" : ""}
						/>
						{isAiLoading ? "Processing..." : "Optimize"}
					</button>

					<button
						onClick={handleSave}
						disabled={isSaving || isAiLoading}
						className='flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 disabled:bg-neutral-400 shadow-sm transition-all cursor-pointer'>
						<Save size={14} />
						{isSaving ? "Saving..." : "Save"}
					</button>
				</div>
			</div>

			<div className='flex flex-wrap items-center gap-2 px-3 py-2 border border-neutral-100 rounded-xl bg-neutral-50/50 min-h-11 focus-within:border-violet-500 transition-colors'>
				{tags.map((tag) => (
					<span
						key={tag}
						className='inline-flex items-center gap-1 text-xs font-bold bg-violet-50 text-violet-600 px-2.5 py-1 rounded-lg border border-violet-100/40 animate-in fade-in zoom-in-95 duration-150'>
						<Hash size={11} />
						{tag}
						<button
							type='button'
							onClick={() => removeTag(tag)}
							className='text-violet-400 hover:text-violet-600 transition-colors rounded-sm cursor-pointer ml-0.5'>
							<X size={11} />
						</button>
					</span>
				))}

				<input
					type='text'
					className='flex-1 bg-transparent outline-none border-none text-sm text-neutral-700 min-w-38 placeholder:text-neutral-400'
					placeholder='Add tag (type and hit Enter)...'
					value={tagInput}
					onChange={(e) => setTagInput(e.target.value)}
					onKeyDown={handleKeyDown}
				/>
			</div>

			<textarea
				value={content}
				onChange={(e) => setContent(e.target.value)}
				className='w-full flex-1 border-none outline-none resize-none text-neutral-600 leading-relaxed text-sm sm:text-base placeholder:text-neutral-400/80 bg-transparent'
				placeholder='Capture your thoughts...'
			/>

			{isAiModalOpen && (
				<div className='fixed inset-0 bg-neutral-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150'>
					<div className='w-full max-w-2xl bg-white rounded-2xl border border-neutral-200 shadow-2xl flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150'>
						<div className='p-4 border-b border-neutral-100 flex items-center justify-between bg-purple-50/40 rounded-t-2xl'>
							<div className='flex items-center gap-2 text-purple-700'>
								<Sparkles size={16} />
								<h3 className='font-bold text-neutral-800 text-sm'>
									Gemini AI Review Suggestion
								</h3>
							</div>
							<button
								onClick={() => setIsAiModalOpen(false)}
								className='p-1 text-neutral-400 hover:text-neutral-600 rounded-xl transition-colors cursor-pointer'>
								<X size={16} />
							</button>
						</div>

						<div className='p-5 flex flex-col md:flex-row gap-4 overflow-y-auto flex-1 text-left'>
							<div className='flex-1 flex flex-col min-w-0'>
								<p className='text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5'>
									Your Original Draft:
								</p>
								<div className='flex-1 bg-neutral-50 p-3 rounded-xl border border-neutral-100 text-xs text-neutral-500 whitespace-pre-wrap select-none overflow-y-auto max-h-[35vh]'>
									{content}
								</div>
							</div>

							<div className='flex-1 flex flex-col min-w-0'>
								<p className='text-[10px] font-bold text-purple-500 uppercase tracking-wider mb-1.5'>
									Gemini AI Suggested Revision:
								</p>
								<div className='flex-1 bg-purple-50/30 p-3 rounded-xl border border-purple-100/30 text-xs text-neutral-700 whitespace-pre-wrap overflow-y-auto max-h-[35vh] leading-relaxed font-normal'>
									{aiSuggestion}
								</div>
							</div>
						</div>

						<div className='p-4 border-t border-neutral-100 bg-neutral-50/50 flex justify-end gap-3 rounded-b-2xl'>
							<button
								onClick={() => {
									setIsAiModalOpen(false);
									setAiSuggestion("");
								}}
								className='px-4 py-2 text-xs font-semibold text-neutral-500 hover:text-neutral-700 cursor-pointer'>
								Discard Suggestion
							</button>
							<button
								onClick={handleReplaceContent}
								className='px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all shadow-sm cursor-pointer'>
								<Save size={14} /> Replace Content
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default CreateNote;
