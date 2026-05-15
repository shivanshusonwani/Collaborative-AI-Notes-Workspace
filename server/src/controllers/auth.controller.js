import User from "../models/user.model.js";
import bcrypt from "bcrypt";

export const register = async (req, res) => {
	try {
		const { name, email, password } = req.body;

		const userExists = await User.findOne({ email });
		if (userExists) {
			return res.status(400).json({ message: "User already exists" });
		}

		const salt = await bcrypt.genSalt(12);
		const hashedPassword = await bcrypt.hash(password, salt);

		const user = await User.create({
			name,
			email,
			password: hashedPassword,
		});

		req.session.userId = user._id;

		res.status(201).json({
			message: "User registered successfully",
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
			},
		});
	} catch (error) {
		res
			.status(500)
			.json({ message: "Registration failed! Please try again later" });
	}
};

export const logIn = async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ email }).select("+password");
		if (!user) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		req.session.userId = user._id;

		res.status(200).json({
			message: "Logged in successfully",
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
			},
		});
	} catch (error) {
		res.status(500).json({
			message: "Unable to sign in at this moment",
		});
	}
};

export const logOut = (req, res) => {
	req.session.destroy((error) => {
		if (error) {
			return res
				.status(500)
				.json({ message: "Unable to complete logout! Please try again" });
		}
		res.clearCookie("connect.sid");
		res.status(200).json({ messag: "Logged out successfully" });
	});
};

export const checkAuth = async (req, res) => {
	try {
		const user = await User.findById(req.session.userId);

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.status(200).json({
			id: user._id,
			name: user.name,
			email: user.email,
		});
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
