import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Notebook, LogOut, LogIn, UserPlus } from "lucide-react";

const Header = () => {
	const { user, logout } = useAuth();
	const location = useLocation();

	const isHomePage = location.pathname === "/";

	return (
		<header className='w-full bg-white/80 backdrop-blur-md border-b border-stone-200/80 sticky top-0 z-50 transition-all duration-200'>
			<div className='max-w-5xl mx-auto px-6 h-16 flex items-center justify-between'>
				{/* Brand Logo Layout */}
				<Link
					to={user ? "/app" : "/"}
					className='flex items-center gap-2 group select-none outline-none'>
					<Notebook className='w-5 h-5 text-violet-600 group-hover:scale-105 transition-transform duration-200' />
					<span className='text-lg font-bold tracking-tight text-stone-900'>
						CoLab Notes<span className='text-violet-600'>.</span>
					</span>
				</Link>

				{/* Right Action Array */}
				<div className='flex items-center gap-3'>
					{user ? (
						<div className='flex items-center gap-4'>
							{/* Optional User Name Display snippet */}
							{user.name && (
								<span className='hidden sm:inline text-xs font-semibold text-stone-500'>
									Hi, {user.name}
								</span>
							)}
							<button
								onClick={logout}
								className='inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-red-600 bg-stone-100 hover:bg-red-50 px-3.5 py-2 rounded-xl transition-all duration-200 border border-stone-200/40 hover:border-red-100 cursor-pointer'>
								<LogOut size={13} />
								Log Out
							</button>
						</div>
					) : (
						isHomePage && (
							<div className='flex items-center gap-2'>
								<Link
									to='/login'
									className='inline-flex items-center gap-1 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100/60 hover:bg-stone-100 border border-stone-200/60 px-3.5 py-2 rounded-xl transition-colors outline-none'>
									<LogIn
										size={13}
										className='text-stone-400'
									/>
									Log In
								</Link>
								<Link
									to='/signup'
									className='inline-flex items-center gap-1 text-xs font-semibold bg-violet-600 hover:bg-violet-700 text-white px-3.5 py-2 rounded-xl transition-colors shadow-sm outline-none cursor-pointer'>
									<UserPlus size={13} />
									Sign Up
								</Link>
							</div>
						)
					)}
				</div>
			</div>
		</header>
	);
};

export default Header;
