/** @format */

import React, { useEffect } from 'react';
import HeaderWithSidebar from '../HeaderWithSidebar';
import UserList from './UserList';
import { refreshUser } from '../../slices/userProfileSlice';
import { useDispatch } from 'react-redux';
import { refreshLocation } from '../../slices/locationSlice';

function Users() {
	const dispatch = useDispatch();

	// Fetch the locations when the component mounts
	useEffect(() => {
		dispatch(refreshUser());
		dispatch(refreshLocation());
	}, [dispatch]);

	return (
		<div>
			<HeaderWithSidebar />
			<UserList />
		</div>
	);
}

export default Users;
