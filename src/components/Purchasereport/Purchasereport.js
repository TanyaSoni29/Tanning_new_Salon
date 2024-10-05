/** @format */

import React, { useEffect, useState } from 'react';
import HeaderWithSidebar from '../HeaderWithSidebar';
import ProductList from './PurchasereportList';
import { useDispatch, useSelector } from 'react-redux';
import {
	getAllServiceTransactions,
	getServicePurchaseReport,
} from '../../service/operations/serviceAndServiceTransaction';
import { refreshLocation } from '../../slices/locationSlice';

function Purchasereport() {
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
	const { locations } = useSelector((state) => state.location);

	const { token } = useSelector((state) => state.auth);
	const [purchaseServiceTransaction, setPurchaseServiceTransaction] = useState(
		[]
	);
	const [dateRange, setDateRange] = useState(getCurrentMonthRange());
	const [selectedLocation, setSelectedLocation] = useState('All');
	useEffect(() => {
		async function getPurchaseServiceReport() {
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

				const response = await getServicePurchaseReport(token, newData);
				setPurchaseServiceTransaction(
					response.sort((a, b) => b.total_quantity - a.total_quantity)
				);
			} catch (error) {
				console.log(error);
			}
		}
		getPurchaseServiceReport();
		dispatch(refreshLocation());
	}, [dispatch, selectedLocation, dateRange]);
	return (
		<div>
			<HeaderWithSidebar />
			<ProductList
				purchaseServiceTransaction={purchaseServiceTransaction}
				dateRange={dateRange}
				setDateRange={setDateRange}
				selectedLocation={selectedLocation}
				setSelectedLocation={setSelectedLocation}
			/>
		</div>
	);
}

export default Purchasereport;
