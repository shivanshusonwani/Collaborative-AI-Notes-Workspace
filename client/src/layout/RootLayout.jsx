import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";

const RootLayout = () => {
	return (
		<div className='h-screen flex flex-col'>
			<Header />
			<div className='container flex-1'>
				<Outlet />
			</div>
		</div>
	);
};

export default RootLayout;
