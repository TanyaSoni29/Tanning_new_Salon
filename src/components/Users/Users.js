/** @format */

import React, { useEffect } from 'react';
import HeaderWithSidebar from '../HeaderWithSidebar';
import UserList from './UserList';
import { refreshUser } from '../../slices/userProfileSlice';
import { useDispatch } from 'react-redux';

function Users() {
	const dispatch = useDispatch();

	// Fetch the locations when the component mounts
	useEffect(() => {
		dispatch(refreshUser());
	}, [dispatch]);

	return (
		<div>
			<HeaderWithSidebar />
			<UserList />
		</div>
	);
}

export default Users;
