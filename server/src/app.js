import express from "express";
import sessionConfig from "./config/session.js";

const app = express();

app.use(sessionConfig);

app.get("/health", (req, res) => {
	res.status(200).json({
		status: "OK",
		message: "server is up and running.",
	});
});

export default app;
