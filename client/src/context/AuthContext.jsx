import { createContext, useContext, useEffect, useState } from "react";
import API from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	const fetchMe = async () => {
		try {
			const res = await API.get("/auth/me");
			setUser(res.data);
		} catch (error) {
			setUser(null);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchMe();
	}, []);

	const login = async (form) => {
		try {
			const { data } = await API.post("/auth/login", form);
			setUser(data.user);
			return { success: true };
		} catch (error) {
			setUser(null);
			return {
				success: false,
				message: error.response?.data?.message || "Login failed",
			};
		}
	};

	const signup = async (form) => {
		try {
			const { data } = await API.post("/auth/register", form);
			setUser(data.user);
			return { success: true };
		} catch (error) {
			setUser(null);
			return {
				success: false,
				message: error.response?.data?.message || "Registration failed",
			};
		}
	};

	const logout = async () => {
		try {
			await API.post("/auth/logout");
		} catch (error) {
			console.error("Logout error", error);
		} finally {
			setUser(null);
		}
	};

	return (
		<AuthContext.Provider value={{ user, login, signup, logout }}>
			{!loading && children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
