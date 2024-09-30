/** @format */

import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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

const App = () => {
	return (
		<Router>
			<div className='app-container'>
				<Routes>
					<Route
						path='/'
						element={<AuthForm />}
					/>
					<Route
						path='/locationStep'
						element={<LocationStep />}
					/>
					<Route
						path='/about'
						element={<AboutStep />}
					/>
					<Route
						path='/service'
						element={<ServiceStep />}
					/>
					<Route
						path='/location'
						element={<Location />}
					/>
					<Route
						path='/users'
						element={<Users />}
					/>
					<Route
						path='/products'
						element={<Products />}
					/>
					<Route
						path='/services'
						element={<Services />}
					/>
					<Route
						path='/customers'
						element={<Customers />}
					/>
					<Route
						path='/transactions'
						element={<Transactions />}
					/>
				</Routes>
			</div>
		</Router>
	);
};

export default App;
