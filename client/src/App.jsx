import {
	Route,
	createBrowserRouter,
	createRoutesFromElements,
	RouterProvider,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import RootLayout from "./layout/RootLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";

function App() {
	const router = createBrowserRouter(
		createRoutesFromElements(
			<Route
				path='/'
				element={<RootLayout />}>
				<Route
					index
					element={<Home />}
				/>
				<Route
					path='login'
					element={<Login />}
				/>
				<Route
					path='signup'
					element={<Signup />}
				/>
				<Route element={<ProtectedRoute />}>
					<Route
						path='/app'
						element={<Dashboard />}
					/>
				</Route>
			</Route>,
		),
	);
	return (
		<>
			<RouterProvider router={router} />
		</>
	);
}

export default App;
