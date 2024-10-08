/** @format */

import React, { useEffect, useState } from 'react';
import HeaderWithSidebar from '../HeaderWithSidebar';
import ServiceusedList from './ServiceusedList';
import { useDispatch, useSelector } from 'react-redux';
import {
	getAllServiceTransactions,
	getServiceUseReport,
} from '../../service/operations/serviceAndServiceTransaction';
import { refreshLocation } from '../../slices/locationSlice';
function Serviceused() {
	const getCurrentMonthRange = () => {
		const now = new Date();
		const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 2);
		const today = new Date();
		return {
			startDate: startOfMonth,
			endDate: today,
		};
	};
	const dispatch = useDispatch();
	const { token } = useSelector((state) => state.auth);
	const [useServiceTransaction, setUseServiceTransaction] = useState([]);
	const { locations } = useSelector((state) => state.location);
	const [dateRange, setDateRange] = useState(getCurrentMonthRange());
	const [selectedLocation, setSelectedLocation] = useState('All');

	useEffect(() => {
		async function getServiceTrnsaction() {
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

				const response = await getServiceUseReport(token, newData);
				setUseServiceTransaction(
					response.sort((a, b) => b.total_quantity - a.total_quantity)
				);
			} catch (error) {
				console.log(error);
			}
		}
		getServiceTrnsaction();
		dispatch(refreshLocation());
	}, [dispatch, selectedLocation, dateRange]);
	return (
		<div>
			<HeaderWithSidebar />
			<ServiceusedList
				useServiceTransaction={useServiceTransaction}
				dateRange={dateRange}
				setDateRange={setDateRange}
				selectedLocation={selectedLocation}
				setSelectedLocation={setSelectedLocation}
			/>
		</div>
	);
}

export default Serviceused;
