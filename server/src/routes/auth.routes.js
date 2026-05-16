import express from "express";
import {
	register,
	logIn,
	logOut,
	checkAuth,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", logIn);

router.post("/logout", protect, logOut);
router.get("/me", protect, checkAuth);

export default router;
