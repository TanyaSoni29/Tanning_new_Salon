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
import { Toaster } from 'react-hot-toast';
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
import Currentmonth from './components/Currentmonth/Currentmonth';
import Topcustomers from './components/Topcustomers/Topcustomers';
import Serviceused from './components/Serviceused/Serviceused';
import Purchasereport from './components/Purchasereport/Purchasereport';
import Productreport from './components/Productreport/Productreport';
import Qrcode from './components/Qrcode/Qrcode';
import './App.css';
import TopHeader from './components/TopHeader';
import { getStats } from './service/operations/statApi';
import { Dashboard } from '@mui/icons-material';
import TopCustomer from './components/Currentmonth/Currentmonth';

const App = () => {
	const dispatch = useDispatch();
	const [selectedLocation, setSelectedLocation] = useState(0);
	const [stats, setStats] = useState({});
	const {
		token,
		loading,
		user: loginUser,
	} = useSelector((state) => state.auth);
	const navigate = useNavigate();
	// Fetch user info on app load if token is available
	useEffect(() => {
		if (token) {
			dispatch(getMe(navigate));
		}
	}, [dispatch, token]);

	useEffect(() => {
		async function stats() {
			try {
				// const response = await getStats(token, selectedLocation);
				const response = await getStats(token, 0);
				console.log('Stats:', response);
				setStats(response.data);
			} catch (error) {
				console.error('Failed to fetch stats:', error);
			}
		}
		stats();
	}, [selectedLocation]);

	const handleLocationChange = (e) => {
		setSelectedLocation(Number(e.target.value));
	};

	return (
		<div className='app-container'>
			{loginUser && (
				<TopHeader
					setSelectedLocation={setSelectedLocation}
					selectedLocation={selectedLocation}
					handleLocationChange={handleLocationChange}
				/>
			)}
			<Routes>
				<Route
					path='/'
					element={<AuthForm />}
				/>
				{/* Protected routes */}
				{/* <Route
					path='/locationStep'
					element={<ProtectedRoute element={<LocationStep />} />}
				/> */}
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
								/>
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

				<Route
					path='/customers'
					element={<ProtectedRoute element={<Customers />} />}
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
