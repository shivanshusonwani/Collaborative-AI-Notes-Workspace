import { createContext, useContext, useEffect, useState } from "react";
import API from "../services/api";

const AuthContext = createContext();

export const AuthContext = ({ children }) => {
	const [user, setUser] = useState(null);

	const fetchMe = async () => {
		try {
			const res = await API.get("/auth/me");
			setUser(res.user);
		} catch (error) {
			setUser(null);
		}
	};

	useEffect(() => {
		fetchMe();
	}, []);

	const login = async (form) => {
		const { data } = await API.post("/auth/login", form);
		setUser(data);
	};

	const signup = async (form) => {
		const { data } = await API.post("/auth/register", form);
		setUser(data);
	};

	const logout = async () => {
		await API.post("/auth/logout");
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, login, signup, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
