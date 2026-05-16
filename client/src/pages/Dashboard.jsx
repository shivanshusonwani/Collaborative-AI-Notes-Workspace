import React from "react";
import Sidebar from "../components/Sidebar";
import Notes from "../components/Notes";

const Dashboard = () => {
	return (
		<>
			<div className='flex h-full'>
				<div className='min-w-80 border-r border-neutral-200'>
					<Sidebar />
				</div>
				<div className='w-full bg-neutral-50'>
					<Notes />
				</div>
			</div>
		</>
	);
};

export default Dashboard;
