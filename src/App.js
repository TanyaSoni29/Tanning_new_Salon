/** @format */

import React, { useEffect, useState } from 'react';
import {
	BrowserRouter as Router,
	Route,
	Routes,
	useNavigate,
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from './service/operations/authApi';
import ProtectedRoute from './utils/ProtectedRoute';
// import { Toaster } from 'react-hot-toast';
import LocationStep from './components/LocationStep';
import AboutStep from './components/AboutStep';
import ServiceStep from './components/ServiceStep';
import AuthForm from './sign-in/AuthForm';
import Location from './components/Location/Location';
import Customers from './components/Customers/Customers';
import Products from './components/Products/Products';
import Services from './components/Services/Services';
// import Transactions from './components/Transactions/Transactions';
import Users from './components/Users/Users';
import Allcustomers from './components/Allcustomers/Allcustomers';
import Bydata from './components/Bydata/Bydata';
// import Currentmonth from './components/Currentmonth/Currentmonth';
// import Topcustomers from './components/Topcustomers/Topcustomers';
import Serviceused from './components/Serviceused/Serviceused';
import Purchasereport from './components/Purchasereport/Purchasereport';
import Productreport from './components/Productreport/Productreport';
// import Qrcode from './components/Qrcode/Qrcode';
import './App.css';
import TopHeader from './components/TopHeader';
// import { getStats } from './service/operations/statApi';
// import { Dashboard } from '@mui/icons-material';
import TopCustomer from './components/Currentmonth/Currentmonth';
import DailyUses from './components/DailyUses/DailyUses';

const App = () => {
	const dispatch = useDispatch();
	const [selectedLocation, setSelectedLocation] = useState(0);
	const [stats, setStats] = useState({});
	const {
		token,
		signupData,
		user: loginUser,
	} = useSelector((state) => state.auth);

	const [selectedLoginLocation, setSelectedLoginLocation] = useState(() =>
		localStorage.getItem('selectedLoginLocation')
			? Number(localStorage.getItem('selectedLoginLocation'))
			: signupData?.locationId
	);
	const navigate = useNavigate();
	const [dashboardSelectedCustomer, setDashboardSelectedCustomer] =
		useState(null);

	// Fetch user info on app load if token is available
	useEffect(() => {
		if (token) {
			dispatch(getMe(navigate));
		}
	}, [dispatch, token]);

	useEffect(() => {
		if (selectedLoginLocation) {
			localStorage.setItem('selectedLoginLocation', selectedLoginLocation);
		}
	}, [selectedLoginLocation]);

	// Redirect to LocationStep if selectedLoginLocation is not set
	// useEffect(() => {
	// 	if (!selectedLoginLocation) {
	// 		navigate('/locationStep');
	// 	}
	// }, [selectedLoginLocation, navigate]);

	const handleLocationChange = (e) => {
		setSelectedLocation(Number(e.target.value));
	};

	const handleLoginLocationChange = (e) => {
		setSelectedLoginLocation(Number(e.target.value));
	};

	return (
		<div className='app-container'>
			{loginUser && (
				<TopHeader
					setSelectedLocation={setSelectedLocation}
					selectedLocation={selectedLocation}
					handleLocationChange={handleLocationChange}
					selectedLoginLocation={selectedLoginLocation}
					setSelectedLoginLocation={setSelectedLoginLocation}
					handleLoginLocationChange={handleLoginLocationChange}
				/>
			)}
			<Routes>
				<Route
					path='/'
					element={<AuthForm />}
				/>
				{/* Protected routes */}
				<Route
					path='/locationStep'
					setSelectedLoginLocation={setSelectedLoginLocation}
					element={
						<ProtectedRoute
							element={
								<LocationStep
									selectedLoginLocation={selectedLoginLocation}
									setSelectedLoginLocation={setSelectedLoginLocation}
									handleLoginLocationChange={handleLoginLocationChange}
								/>
							}
						/>
					}
				/>
				{/* <Route
					path='/dashboard'
					element={<ProtectedRoute element={<Dashboard stats={stats} />} />}
				/> */}
				<Route
					path='/about'
					element={
						<ProtectedRoute
							element={
								<AboutStep
									stats={stats}
									setSelectedLocation={setSelectedLocation}
									selectedLocation={selectedLocation}
									selectedLoginLocation={selectedLoginLocation}
									setStats={setStats}
									setDashboardSelectedCustomer={setDashboardSelectedCustomer}
								/>
							}
						/>
					}
				/>
				<Route
					path='/service'
					element={
						<ProtectedRoute
							element={
								<ServiceStep
									stats={stats}
									selectedLocation={selectedLocation}
									selectedLoginLocation={selectedLoginLocation}
									setSelectedLoginLocation={setSelectedLoginLocation}
									dashboardSelectedCustomer={dashboardSelectedCustomer}
								/>
							}
						/>
					}
				/>
				<Route
					path='/customers'
					element={
						<ProtectedRoute
							element={
								<Customers selectedLoginLocation={selectedLoginLocation} />
							}
						/>
					}
				/>
				{loginUser?.role === 'admin' && (
					<>
						<Route
							path='/location'
							element={<ProtectedRoute element={<Location />} />}
						/>
						<Route
							path='/users'
							element={<ProtectedRoute element={<Users />} />}
						/>
						<Route
							path='/services'
							element={<ProtectedRoute element={<Services />} />}
						/>
						<Route
							path='/allcustomers'
							element={<ProtectedRoute element={<Allcustomers />} />}
						/>
						<Route
							path='/bydata'
							element={<ProtectedRoute element={<Bydata />} />}
						/>
						<Route
							path='/topcustomers'
							element={<ProtectedRoute element={<TopCustomer />} />}
						/>
						{/* <Route
							path='/topcustomers'
							element={<ProtectedRoute element={<Topcustomers />} />}
						/> */}
						<Route
							path='/serviceused'
							element={<ProtectedRoute element={<Serviceused />} />}
						/>
						<Route
							path='/dailyUses'
							element={<ProtectedRoute element={<DailyUses />} />}
						/>
						<Route
							path='/purchasereport'
							element={<ProtectedRoute element={<Purchasereport />} />}
						/>
						<Route
							path='/productreport'
							element={<ProtectedRoute element={<Productreport />} />}
						/>
						{/* <Route
							path='/qrcode'
							element={<ProtectedRoute element={<Qrcode />} />}
						/> */}
					</>
				)}
				<Route
					path='/products'
					element={<ProtectedRoute element={<Products />} />}
				/>

				{/* <Route
					path='/transactions'
					element={<ProtectedRoute element={<Transactions />} />}
				/> */}
			</Routes>
		</div>
	);
};

export default App;
