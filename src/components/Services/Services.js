/** @format */

import React, { useEffect } from 'react';
import HeaderWithSidebar from '../HeaderWithSidebar';
import ServiceList from './ServiceList';
import { useDispatch } from 'react-redux';
import { refreshProduct } from '../../slices/productSlice';

function Services() {
	const dispatch = useDispatch();
	useEffect(() => {
           dispatch(refreshProduct())
	},[])
	return (
		<div>
			<HeaderWithSidebar />
			<ServiceList />
		</div>
	);
}

export default Services;
