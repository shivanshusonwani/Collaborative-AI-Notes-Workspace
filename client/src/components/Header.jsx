import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
	return (
		<header className='w-full shadow-md'>
			<div className='max-w-7xl mx-auto px-8 pt-4 pb-2 flex justify-between'>
				<Link to='/'>
					<h1 className='text-2xl font-semibold'>CoLab Notes</h1>
				</Link>
				<div className='flex gap-2'>
					<Link
						to='/login'
						className='border text-sm rounded-md px-2 py-1 cursor-pointer'>
						Log in
					</Link>
					<Link
						to='/signup'
						className='bg-violet-500 text-white text-sm rounded-md px-2 py-1 cursor-pointer'>
						Sign up
					</Link>
				</div>
			</div>
		</header>
	);
};

export default Header;
