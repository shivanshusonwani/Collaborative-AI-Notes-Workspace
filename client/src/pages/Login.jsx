import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
	const [form, setForm] = useState({ email: "", password: "" });
	const [error, setError] = useState("");

	const { login } = useAuth();
	const navigate = useNavigate();

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		const res = await login(form);

		if (res.success) {
			navigate("/");
		} else {
			setError(res.message);
		}
	};

	return (
		<div className='h-full flex items-center justify-center'>
			<form
				onSubmit={handleSubmit}
				className='w-full max-w-sm p-6 rounded-md shadow-md space-y-4'>
				<h2 className='text-xl font-bold text-center'>Login</h2>

				<input
					type='email'
					name='email'
					placeholder='Email'
					value={form.email}
					onChange={handleChange}
					className='w-full p-2 border rounded'
				/>

				<input
					type='password'
					name='password'
					placeholder='Password'
					value={form.password}
					onChange={handleChange}
					className='w-full p-2 border rounded'
				/>

				<button className='w-full bg-violet-500 text-white py-2 rounded cursor-pointer'>
					Login
				</button>
				<p className='text-sm text-center'>
					Don't have an account?{" "}
					<Link
						to='/signup'
						className='text-violet-600 font-semibold underline underline-offset-2 cursor-pointer'>
						Sign Up
					</Link>
				</p>
			</form>
		</div>
	);
};

export default Login;
