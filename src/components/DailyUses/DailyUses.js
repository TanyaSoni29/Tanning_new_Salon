/** @format */

import React, { useEffect, useState } from 'react';
import HeaderWithSidebar from '../HeaderWithSidebar';
import DailyUsesList from './DailyUsesList';
import { useDispatch, useSelector } from 'react-redux';
import {
	getAllServiceTransactions,
	getServiceDailyUsesReport,
	getServiceUseReport,
} from '../../service/operations/serviceAndServiceTransaction';
import { refreshLocation } from '../../slices/locationSlice';
function DailyUses() {
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
	const [dailyUseServiceTransaction, setDailyUseServiceTransaction] = useState(
		[]
	);
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

				const response = await getServiceDailyUsesReport(token, newData);
				// console.log('response for daily uses-', response.data);
				setDailyUseServiceTransaction(
					response.data.sort((a, b) => new Date(b.date) - new Date(a.date))
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
			<DailyUsesList
				dailyUseServiceTransaction={dailyUseServiceTransaction}
				dateRange={dateRange}
				setDateRange={setDateRange}
				selectedLocation={selectedLocation}
				setSelectedLocation={setSelectedLocation}
			/>
		</div>
	);
}

export default DailyUses;
