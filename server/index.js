import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";

const startServer = async () => {
	try {
		await connectDB();

		const port = process.env.PORT || 8000;

		app.listen(port, () => console.log(`server is running on ${port}`));
	} catch (error) {
		console.error("Server initialization failed.", error);
	}
};

startServer();
