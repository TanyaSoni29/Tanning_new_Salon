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
import Allcustomers from './components/Allcustomers/Allcustomers';
import Bydata from './components/Bydata/Bydata';
import Currentmonth from './components/Currentmonth/Currentmonth';
import Topcustomers from './components/Topcustomers/Topcustomers';
import Serviceused from './components/Serviceused/Serviceused';
import Purchasereport from './components/Purchasereport/Purchasereport';
import Productreport from './components/Productreport/Productreport';

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
					<Route
						path='/allcustomers'
						element={<Allcustomers />}
					/>
					<Route
						path='/bydata'
						element={<Bydata />}
					/>
					<Route
						path='/currentmonth'
						element={<Currentmonth />}
					/>
					<Route
						path='/topcustomers'
						element={<Topcustomers />}
					/>
					<Route
						path='/serviceused'
						element={<Serviceused />}
					/>
					<Route
						path='/purchasereport'
						element={<Purchasereport />}
					/>
					<Route
						path='/productreport'
						element={<Productreport />}
					/>
				</Routes>
			</div>
		</Router>
	);
};

export default App;
