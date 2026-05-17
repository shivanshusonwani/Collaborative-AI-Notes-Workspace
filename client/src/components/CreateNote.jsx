import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNotes } from "../context/NoteContext";
// Added X and Hash icons
import { Save, CheckCircle, ArrowLeft, X, Hash } from "lucide-react";

const CreateNote = () => {
	const { selectedNote, setSelectedNote, saveNoteChanges } = useNotes();

	const navigate = useNavigate();

	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [isSaving, setIsSaving] = useState(false);
	const [saveSuccess, setSaveSuccess] = useState(false);

	const [tags, setTags] = useState([]);
	const [tagInput, setTagInput] = useState("");

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

	return (
		<div className='lg:col-span-2 flex flex-col gap-4 bg-white p-6 rounded-2xl shadow-sm border border-neutral-200/60 h-full'>
			<div className='flex items-center justify-between border-b border-neutral-100 pb-4 '>
				<button
					onClick={handleBack}
					className='p-2 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer text-neutral-500'>
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
						onClick={handleSave}
						disabled={isSaving}
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
					className='flex-1 bg-transparent outline-none border-none text-sm text-neutral-700 min-w-[150px] placeholder:text-neutral-400'
					placeholder='Add tag (type and hit Enter or comma)...'
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
		</div>
	);
};

export default CreateNote;
