export const protect = (req, res, next) => {
	if (!req.session || !req.session.userId) {
		return res.status(401).json({
			message: "Unauthorized: Access denied. Please log in first.",
		});
	}

	next();
};
