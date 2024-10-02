/** @format */

import React, { useEffect, useState } from 'react';
import HeaderWithSidebar from '../HeaderWithSidebar';
import ProductList from './ProductreportList';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProductTransactions } from '../../service/operations/productAndProductTransaction';
import { refreshLocation } from '../../slices/locationSlice';
function Productreport() {
	const dispatch = useDispatch();
	const { token } = useSelector((state) => state.auth);
	const [productTransaction, setProductTransaction] = useState([]);
	useEffect(() => {
		async function getPurchaseServiceTrnsaction() {
			try {
				const response = await getAllProductTransactions(token);
				setProductTransaction(
					response.sort(
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
			<ProductList productTransaction={productTransaction} />
		</div>
	);
}

export default Productreport;
