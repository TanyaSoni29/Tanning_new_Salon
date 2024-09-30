/** @format */

import React, { useEffect } from 'react';
import HeaderWithSidebar from '../HeaderWithSidebar';
import LocationList from './LocationList';
import { useDispatch } from 'react-redux';
import { refreshLocation } from '../../slices/locationSlice';

function Location() {
	const dispatch = useDispatch();

	// Fetch the locations when the component mounts
	useEffect(() => {
		dispatch(refreshLocation());
	}, [dispatch]);

	return (
		<div>
			<HeaderWithSidebar />
			<LocationList />
		</div>
	);
}

export default Location;
