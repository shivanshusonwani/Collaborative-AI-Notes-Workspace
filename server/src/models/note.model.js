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
	},
	{
		timestamps: true,
	},
);

const Note = model("Note", noteSchema);
export default Note;
