import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Notebook, LogIn, AlertCircle } from "lucide-react";

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
			navigate("/app");
		} else {
			setError(res.message || "Invalid credentials. Please try again.");
		}
	};

	return (
		<div className='h-full bg-stone-50 text-stone-800 flex items-center justify-center px-4 font-sans selection:bg-violet-100 selection:text-violet-900'>
			<div className='w-full max-w-md bg-white border border-stone-200/80 p-8 rounded-2xl shadow-sm shadow-stone-200/40 space-y-6'>
				<div className='flex flex-col items-center space-y-2'>
					<h2 className='text-xl font-bold tracking-tight text-stone-900 mt-1'>
						Welcome Back
					</h2>
					<p className='text-xs font-medium text-stone-400'>
						Access your workspace documents
					</p>
				</div>

				{error && (
					<div className='flex items-start gap-2 bg-red-50 text-red-600 border border-red-100 p-3 rounded-xl text-xs font-semibold animate-in fade-in slide-in-from-top-1 duration-200'>
						<AlertCircle
							size={14}
							className='mt-0.5 shrink-0'
						/>
						<span>{error}</span>
					</div>
				)}

				<form
					onSubmit={handleSubmit}
					className='space-y-4'>
					<div className='space-y-1'>
						<label className='text-[11px] font-bold uppercase tracking-wider text-stone-400'>
							Email Address
						</label>
						<input
							type='email'
							name='email'
							required
							placeholder='name@example.com'
							value={form.email}
							onChange={handleChange}
							className='w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl placeholder-stone-400 text-stone-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 focus:bg-white transition-all outline-none'
						/>
					</div>

					<div className='space-y-1'>
						<label className='text-[11px] font-bold uppercase tracking-wider text-stone-400'>
							Account Password
						</label>
						<input
							type='password'
							name='password'
							required
							placeholder='••••••••'
							value={form.password}
							onChange={handleChange}
							className='w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl placeholder-stone-400 text-stone-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 focus:bg-white transition-all outline-none'
						/>
					</div>

					<button
						type='submit'
						className='w-full inline-flex items-center justify-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-xl py-2.5 mt-2 transition-colors shadow-sm outline-none cursor-pointer'>
						<LogIn size={15} />
						Sign In
					</button>
				</form>

				<p className='text-xs font-medium text-center text-stone-400 pt-2 border-t border-stone-100'>
					Don't have an account?{" "}
					<Link
						to='/signup'
						className='text-violet-600 font-semibold hover:text-violet-700 transition-colors outline-none'>
						Sign Up Free
					</Link>
				</p>
			</div>
		</div>
	);
};

export default Login;
