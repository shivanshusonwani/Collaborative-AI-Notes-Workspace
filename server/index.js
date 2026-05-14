import "dotenv/config";
import app from "./src/app.js";

const startServer = () => {
	const port = process.env.PORT || 8000;

	app.listen(port, () => console.log(`server is running on ${port}`));
};

startServer();
