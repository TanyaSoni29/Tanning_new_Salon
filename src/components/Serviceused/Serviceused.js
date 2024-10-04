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
	const dispatch = useDispatch();
	const { token } = useSelector((state) => state.auth);
	const [useServiceTransaction, setUseServiceTransaction] = useState([]);
	useEffect(() => {
		async function getServiceTrnsaction() {
			try {
				const response = await getServiceUseReport(token);
				setUseServiceTransaction(
					response.sort((a, b) => new Date(b.date) - new Date(a.date))
				);
			} catch (error) {
				console.log(error);
			}
		}
		getServiceTrnsaction();
		dispatch(refreshLocation());
	}, []);
	return (
		<div>
			<HeaderWithSidebar />
			<ServiceusedList useServiceTransaction={useServiceTransaction} />
		</div>
	);
}

export default Serviceused;
