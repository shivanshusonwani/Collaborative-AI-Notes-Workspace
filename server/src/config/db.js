import { connect } from "mongoose";

const connectDB = async () => {
	try {
		await connect(`${process.env.MONGODB_URI}`);
		console.log("Database Connected.");
	} catch (error) {
		console.log("Database connection failed!");
		process.exit(1);
	}
};

export default connectDB;
