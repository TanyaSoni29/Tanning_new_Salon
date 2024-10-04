import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaUserCircle } from 'react-icons/fa';
import { useLocation } from 'react-router-dom'; // Import useLocation from react-router-dom
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

	// Get the current route path using useLocation
	const locationPath = useLocation().pathname;

	// Filter locations based on the route (logic can be customized)
	const filteredLocations = locations.filter((location) => {
		// Example logic: Filter based on route name
		if (locationPath === '/location') {
			// Show only specific locations for '/route1'
			return location.route === '/about';
		} else if (locationPath === '/users') {
			// Show only specific locations for '/route2'
			return location.route === '/about';
		} else if (locationPath === '/customers') {
			// Show only specific locations for '/route2'
			return location.route === '/about';
		} else if (locationPath === '/products') {
			// Show only specific locations for '/route2'
			return location.route === '/about';
		} else if (locationPath === '/services') {
			// Show only specific locations for '/route2'
			return location.route === '/about';
		} else if (locationPath === '/allcustomers') {
			// Show only specific locations for '/route2'
			return location.route === '/about';
		} else if (locationPath === '/currentmonth') {
			// Show only specific locations for '/route2'
			return location.route === '/about';
		} else if (locationPath === '/productreport') {
			// Show only specific locations for '/route2'
			return location.route === '/about';
		} else if (locationPath === '/purchasereport') {
			// Show only specific locations for '/route2'
			return location.route === '/about';
		}  else if (locationPath === '/purchasereport') {
			// Show only specific locations for '/route2'
			return location.route === '/about';
		} else {
			// Default: Show all locations
			return true;
		}
	});

	// Find the location name based on the preferred location ID
	const locationName = filteredLocations.find((l) => l.id === preferredLocationId);

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
				{filteredLocations.map((location) => (
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



