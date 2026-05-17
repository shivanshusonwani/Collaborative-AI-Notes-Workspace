import { Schema, model } from "mongoose";

const noteSchema = new Schema(
	{
		owner: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		title: {
			type: String,
			default: "Untitled Note",
			trim: true,
		},
		content: {
			type: String,
			default: "",
		},
		tags: {
			type: [String],
			default: [],
		},
		isArchived: {
			type: Boolean,
			default: false,
		},
		isPublic: {
			type: Boolean,
			default: false,
		},
		publicShareId: {
			type: String,
			unique: true,
			sparse: true,
		},
		collaborators: [
			{
				type: Schema.Types.ObjectId,
				ref: "User",
			},
		],
	},
	{
		timestamps: true,
	},
);

noteSchema.index({ title: "text", content: "text", tags: 1 });

const Note = model("Note", noteSchema);
export default Note;
