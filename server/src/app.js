import express from "express";
import sessionConfig from "./config/session.js";
import authRoutes from "./routes/auth.routes.js";
import noteRoutes from "./routes/note.routes.js";

const app = express();

app.use(express.json());
app.use(sessionConfig);

app.get("/health", (req, res) => {
	res.status(200).json({
		status: "OK",
		message: "server is up and running.",
	});
});

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

export default app;
