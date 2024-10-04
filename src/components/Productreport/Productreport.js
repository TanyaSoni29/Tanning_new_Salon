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
	const [productTransaction, setProductTransaction] = useState([]);
	useEffect(() => {
		async function getProductReportData() {
			try {
				const response = await getProductReport(token);
				console.log(response);
				setProductTransaction(
					response.sort(
						(a, b) =>
							new Date(b.last_transaction_date) -
							new Date(a.last_transaction_date)
					)
				);
			} catch (error) {
				console.log(error);
			}
		}
		getProductReportData();
		dispatch(refreshLocation());
	}, [dispatch]);

	console.log('Product---', productTransaction);
	return (
		<div>
			<HeaderWithSidebar />
			<ProductList productTransaction={productTransaction} />
		</div>
	);
}

export default Productreport;
