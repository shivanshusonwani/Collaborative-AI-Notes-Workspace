import React from "react";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Home = () => {
	return (
		<div className='h-full flex justify-center items-center px-8'>
			<div className='space-y-4'>
				<h1 className='max-w-2xl text-6xl font-bold'>
					Collaborative AI Notes Workspace
				</h1>
				<Link
					to='/signup'
					className='bg-violet-500 text-white text-xl font-semibold rounded-md px-2 py-1 inline-flex items-center gap-2
					 cursor-pointer'>
					Get Started <ArrowRight size={20} />
				</Link>
			</div>
		</div>
	);
};

export default Home;
