import React from "react";
import Sidebar from "../components/Sidebar";
import Notes from "../components/Notes";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
	return (
		<>
			<div className='flex h-full'>
				<div className='min-w-80 border-r border-neutral-200'>
					<Sidebar />
				</div>
				<div className='w-full p-6 bg-neutral-50'>
					<Outlet />
				</div>
			</div>
		</>
	);
};

export default Dashboard;
