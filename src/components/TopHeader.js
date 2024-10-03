/** @format */

import React from 'react';
import { useSelector } from 'react-redux';
import { FaUserCircle } from 'react-icons/fa';
import './TopHeader.css';

function TopHeader() {
	const { user: loginUser } = useSelector((state) => state.auth);
	const { users } = useSelector((state) => state.userProfile);
	const { locations } = useSelector((state) => state.location);

	// Find the logged-in user details from the users array
	const userDetails = users.find((user) => user.user.id === loginUser?.id);

	// Extract the preferred location ID from the logged-in user profile
	const preferredLocationId = userDetails?.profile?.preferred_location;
	const locationName = locations.find((l) => l.id === preferredLocationId);
	return (
		<header className='top-header'>
			<div className='login-details'>
				<FaUserCircle
					size={28}
					style={{ marginLeft: '20px' }}
				/>
				<span className='topheadname'>
					{loginUser?.name || 'User'} (<span>{locationName?.name}</span>)
				</span>{' '}
				{/* Display User Name */}
				{/* Add more user info or logout option */}
			</div>
		</header>
	);
}

export default TopHeader;
