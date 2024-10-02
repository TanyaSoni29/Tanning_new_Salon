/** @format */

import React, { useEffect, useState } from 'react';
import HeaderWithSidebar from '../HeaderWithSidebar';
import ProductList from './PurchasereportList';
import { useDispatch, useSelector } from 'react-redux';
import { getAllServiceTransactions } from '../../service/operations/serviceAndServiceTransaction';
import { refreshLocation } from '../../slices/locationSlice';

function Purchasereport() {
	const dispatch = useDispatch();
	const { token } = useSelector((state) => state.auth);
	const [purchaseServiceTransaction, setPurchaseServiceTransaction] = useState(
		[]
	);
	useEffect(() => {
		async function getPurchaseServiceTrnsaction() {
			try {
				const response = await getAllServiceTransactions(token);
				setPurchaseServiceTransaction(
					response
						.filter(
							(transaction) => transaction.transaction.type === 'purchased'
						)
						.sort(
							(a, b) =>
								new Date(b.transaction.created_at) -
								new Date(a.transaction.created_at)
						)
				);
			} catch (error) {
				console.log(error);
			}
		}
		getPurchaseServiceTrnsaction();
		dispatch(refreshLocation());
	}, []);
	return (
		<div>
			<HeaderWithSidebar />
			<ProductList purchaseServiceTransaction={purchaseServiceTransaction} />
		</div>
	);
}

export default Purchasereport;
