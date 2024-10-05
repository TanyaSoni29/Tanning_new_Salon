/** @format */

import React, { useEffect, useState } from 'react';
import HeaderWithSidebar from '../HeaderWithSidebar';
import ProductList from './AllcustomersList';
import { useDispatch } from 'react-redux';
import { refreshCustomers } from '../../slices/customerProfile';
import { refreshLocation } from '../../slices/locationSlice';

function Allcustomers() {
	const getCurrentMonthRange = () => {
		const now = new Date();
		const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 2);
		const today = new Date();
		return {
			startDate: startOfMonth,
			endDate: today,
		};
	};
	const [dateRange, setDateRange] = useState(getCurrentMonthRange());
	const [selectedLocation, setSelectedLocation] = useState('All');
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(refreshCustomers());
		dispatch(refreshLocation());
	}, [dispatch]);

	return (
		<div>
			<HeaderWithSidebar />
			<ProductList />
		</div>
	);
}

export default Allcustomers;
