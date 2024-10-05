/** @format */

import React, { useEffect, useState } from 'react';
import HeaderWithSidebar from '../HeaderWithSidebar';
import ProductList from './ProductreportList';
import { useDispatch, useSelector } from 'react-redux';
import {
	getAllProductTransactions,
	getProductReport,
} from '../../service/operations/productAndProductTransaction';
import { refreshLocation } from '../../slices/locationSlice';
function Productreport() {
	const dispatch = useDispatch();
	const { token } = useSelector((state) => state.auth);
	const getCurrentMonthRange = () => {
		const now = new Date();
		const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 2);
		const today = new Date();
		return {
			startDate: startOfMonth,
			endDate: today,
		};
	};
	const [productTransaction, setProductTransaction] = useState([]);
	const [dateRange, setDateRange] = useState(getCurrentMonthRange());
	const [selectedLocation, setSelectedLocation] = useState('All');
	const { locations } = useSelector((state) => state.location);
	useEffect(() => {
		async function getProductReportData() {
			const locationId = locations.find(
				(location) => location.name === selectedLocation
			);

			const start_date = dateRange.startDate.toISOString().split('T')[0];
			const end_date = dateRange.endDate.toISOString().split('T')[0];
			try {
				const newData = {
					start_date: start_date,
					end_date: end_date,
					location_id: selectedLocation === 'All' ? '' : locationId.id,
				};
				const response = await getProductReport(token, newData);
				console.log(response);
				setProductTransaction(
					response.sort((a, b) => b.total_sold - a.total_sold)
				);
			} catch (error) {
				console.log(error);
			}
		}
		getProductReportData();
		dispatch(refreshLocation());
	}, [dispatch, selectedLocation, dateRange]);

	console.log('Product---', productTransaction);
	return (
		<div>
			<HeaderWithSidebar />
			<ProductList
				productTransaction={productTransaction}
				dateRange={dateRange}
				setDateRange={setDateRange}
				selectedLocation={selectedLocation}
				setSelectedLocation={setSelectedLocation}
			/>
		</div>
	);
}

export default Productreport;
