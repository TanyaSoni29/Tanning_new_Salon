/** @format */

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaUserCircle } from 'react-icons/fa';
import './TopHeader.css';

function TopHeader({
	setSelectedLocation,
	selectedLocation,
	handleLocationChange,
}) {
	const { user: loginUser } = useSelector((state) => state.auth);
	const { users } = useSelector((state) => state.userProfile);
	const { locations } = useSelector((state) => state.location);

	// Find the logged-in user details from the users array
	const userDetails = users.find((user) => user.user.id === loginUser?.id);

	// Extract the preferred location ID from the logged-in user profile
	const preferredLocationId = userDetails?.profile?.preferred_location;
	const locationName = locations.find((l) => l.id === preferredLocationId);
	useEffect(() => {
		if (preferredLocationId) {
			setSelectedLocation(preferredLocationId); // Set the default selected location
		}
	}, [preferredLocationId, setSelectedLocation]);
	return (
		<header className='top-header'>
			<select
				value={selectedLocation}
				onChange={handleLocationChange}
				className='location-select'
			>
				{locations.map((location) => (
					<option
						key={location.id}
						value={location.id}
					>
						{location?.name}
					</option>
				))}
			</select>
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
