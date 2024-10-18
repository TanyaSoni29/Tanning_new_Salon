import React, { useEffect } from 'react';
import HeaderWithSidebar from '../HeaderWithSidebar';
import ServiceList from './ServiceList';
import { useDispatch } from 'react-redux';
import { refreshService } from '../../slices/serviceSlice';

function Services() {
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(refreshService());
	}, [dispatch]);
	return (
		<div>
			<HeaderWithSidebar />
			<ServiceList />
		</div>
	);
}

export default Services;
