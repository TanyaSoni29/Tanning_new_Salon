/** @format */

import React, { useEffect, useState } from 'react';
import HeaderWithSidebar from '../HeaderWithSidebar';
import BydataList from './BydataList';
import { useDispatch, useSelector } from 'react-redux';
import { getCustomerByDateAndLocation } from '../../service/operations/userApi';
import { refreshCustomers } from '../../slices/customerProfile';
import { refreshLocation } from '../../slices/locationSlice';

function Bydata() {
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(refreshCustomers());
		dispatch(refreshLocation());
	}, [dispatch]);
	return (
		<div>
			<HeaderWithSidebar />
			<BydataList />
		</div>
	);
}

export default Bydata;
