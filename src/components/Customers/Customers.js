/** @format */

import React, { useEffect } from 'react';
import HeaderWithSidebar from '../HeaderWithSidebar';
import CustomerList from './CustomerList';
import { useDispatch } from 'react-redux';
import { refreshLocation } from '../../slices/locationSlice';

function Customers({ selectedLoginLocation }) {
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(refreshLocation());
	}, [dispatch]);
	return (
		<div>
			<HeaderWithSidebar />
			<CustomerList selectedLoginLocation={selectedLoginLocation} />
		</div>
	);
}

export default Customers;
