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

const App = () => {
	const dispatch = useDispatch();
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
	}, [dispatch]);

	return (
		<div className='app-container'>
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
				<Route
					path='/about'
					element={<ProtectedRoute element={<AboutStep />} />}
				/>
				<Route
					path='/service'
					element={<ProtectedRoute element={<ServiceStep />} />}
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
							path='/currentmonth'
							element={<ProtectedRoute element={<Currentmonth />} />}
						/>
						<Route
							path='/topcustomers'
							element={<ProtectedRoute element={<Topcustomers />} />}
						/>
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
						<Route
							path='/qrcode'
							element={<ProtectedRoute element={<Qrcode />} />}
						/>
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
