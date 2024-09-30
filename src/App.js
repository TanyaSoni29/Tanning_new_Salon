/** @format */

import React, { useEffect } from 'react';
import {
	BrowserRouter as Router,
	Route,
	Routes,
	useNavigate,
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from './service/operations/authApi';
import ProtectedRoute from './utils/ProtectedRoute';
import LocationStep from './components/LocationStep';
import AboutStep from './components/AboutStep';
import ServiceStep from './components/ServiceStep';
import AuthForm from './sign-in/AuthForm';
import Location from './components/Location/Location';
import Customers from './components/Customers/Customers';
import Products from './components/Products/Products';
import Services from './components/Services/Services';
import Transactions from './components/Transactions/Transactions';
import Users from './components/Users/Users';
import './App.css';

const App = () => {
	const dispatch = useDispatch();
	const { token, loading } = useSelector((state) => state.auth);
	const navigate = useNavigate();
	// Fetch user info on app load if token is available
	useEffect(() => {
		if (token) {
			dispatch(getMe(navigate));
		}
	}, []);

	return (
		<div className='app-container'>
			<Routes>
				<Route
					path='/'
					element={<AuthForm />}
				/>
				{/* Protected routes */}
				<Route
					path='/locationStep'
					element={<ProtectedRoute element={<LocationStep />} />}
				/>
				<Route
					path='/about'
					element={<ProtectedRoute element={<AboutStep />} />}
				/>
				<Route
					path='/service'
					element={<ProtectedRoute element={<ServiceStep />} />}
				/>
				<Route
					path='/location'
					element={<ProtectedRoute element={<Location />} />}
				/>
				<Route
					path='/users'
					element={<ProtectedRoute element={<Users />} />}
				/>
				<Route
					path='/products'
					element={<ProtectedRoute element={<Products />} />}
				/>
				<Route
					path='/services'
					element={<ProtectedRoute element={<Services />} />}
				/>
				<Route
					path='/customers'
					element={<ProtectedRoute element={<Customers />} />}
				/>
				<Route
					path='/transactions'
					element={<ProtectedRoute element={<Transactions />} />}
				/>
			</Routes>
		</div>
	);
};

export default App;
