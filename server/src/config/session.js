import session from "express-session";
import MongoStore from "connect-mongo";

const sessionConfig = session({
	name: "sid",
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
	cookie: {
		maxAge: 1000 * 60 * 60 * 24, // 1 day
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
	},
	proxy: process.env.NODE_ENV === "production" ? true : undefined,
	store: MongoStore.create({
		mongoUrl: process.env.MONGODB_URI,
		collectionName: "sessions",
	}),
});

export default sessionConfig;
