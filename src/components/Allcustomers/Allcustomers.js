/** @format */

import React, { useEffect, useState } from 'react';
import HeaderWithSidebar from '../HeaderWithSidebar';
import ProductList from './AllcustomersList';
import { useDispatch, useSelector } from 'react-redux';
import { refreshCustomers } from '../../slices/customerProfile';
import { refreshLocation } from '../../slices/locationSlice';
import { getAllCustomerReport } from '../../service/operations/userApi';

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
	const { locations } = useSelector((state) => state.location);
	const { token } = useSelector((state) => state.auth);
	const [customerReportData, setCustomerReportData] = useState([]);
	useEffect(() => {
		async function getCustomerReport() {
			const locationId = locations.find(
				(location) => location.name === selectedLocation
			);
			const start_date =
				dateRange.startDate instanceof Date && !isNaN(dateRange.startDate)
					? dateRange.startDate.toISOString().split('T')[0]
					: null;
			const end_date =
				dateRange.endDate instanceof Date && !isNaN(dateRange.endDate)
					? dateRange.endDate.toISOString().split('T')[0]
					: null;

			if (!start_date || !end_date) {
				console.error('Invalid date range provided.');
				return;
			}
			try {
				const newData = {
					start_date: start_date,
					end_date: end_date,
					location_id: selectedLocation === 'All' ? '' : locationId.id,
				};

				const response = await getAllCustomerReport(token, newData);
				setCustomerReportData(response.data);
			} catch (error) {
				console.log(error);
			}
		}
		getCustomerReport();
		dispatch(refreshCustomers());
		dispatch(refreshLocation());
	}, [dispatch, selectedLocation, dateRange]);

	return (
		<div>
			<HeaderWithSidebar />
			<ProductList
				customerReportData={customerReportData}
				dateRange={dateRange}
				setDateRange={setDateRange}
				selectedLocation={selectedLocation}
				setSelectedLocation={setSelectedLocation}
				getCurrentMonthRange={getCurrentMonthRange}
			/>
		</div>
	);
}

export default Allcustomers;
