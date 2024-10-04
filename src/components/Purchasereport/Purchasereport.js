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
	const dispatch = useDispatch();
	const { token } = useSelector((state) => state.auth);
	const [purchaseServiceTransaction, setPurchaseServiceTransaction] = useState(
		[]
	);
	useEffect(() => {
		async function getPurchaseServiceReport() {
			try {
				const response = await getServicePurchaseReport(token);
				setPurchaseServiceTransaction(
					response.sort((a, b) => new Date(b.date) - new Date(a.date))
				);
			} catch (error) {
				console.log(error);
			}
		}
		getPurchaseServiceReport();
		dispatch(refreshLocation());
	}, [dispatch]);
	return (
		<div>
			<HeaderWithSidebar />
			<ProductList purchaseServiceTransaction={purchaseServiceTransaction} />
		</div>
	);
}

export default Purchasereport;
