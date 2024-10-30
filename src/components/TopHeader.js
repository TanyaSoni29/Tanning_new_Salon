/** @format */

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FaUserCircle } from 'react-icons/fa';
import { IoLocationSharp } from 'react-icons/io5';
import { MdOutlineDarkMode, MdOutlineLightMode } from 'react-icons/md'; // Import icons for light and dark mode
import { useLocation } from 'react-router-dom';
import './TopHeader.css';

function TopHeader({
	setSelectedLocation,
	selectedLocation,
	handleLocationChange,
	selectedLoginLocation,
	setSelectedLoginLocation,
	handleLoginLocationChange,
}) {
	const { user: loginUser } = useSelector((state) => state.auth);
	const { users } = useSelector((state) => state.userProfile);
	const { locations } = useSelector((state) => state.location);
	const [menuOpen, setMenuOpen] = useState(false);
	const [theme, setTheme] = useState('light'); // Theme state for toggling

	const userDetails = users.find((user) => user.user.id === selectedLoginLocation);
	const preferredLocationId = userDetails?.profile?.preferred_location;
	const locationPath = useLocation().pathname;
	const selectedLocationName = locations.find(
		(location) => location.id === selectedLoginLocation
	)?.name;

	const filteredLocations = locations.filter((location) => location.isActive);
	const locationName = filteredLocations.find(
		(l) => l.id === preferredLocationId
	);

	useEffect(() => {
        const storedLocation = Number(localStorage.getItem('selectedLoginLocation'));
        if (!storedLocation && preferredLocationId) {
            setSelectedLocation(preferredLocationId);
            setSelectedLoginLocation(preferredLocationId);
        }
    }, [preferredLocationId, setSelectedLocation, setSelectedLoginLocation]);

	// Handle theme change
	useEffect(() => {
		document.documentElement.setAttribute('data-theme', theme);
	}, [theme]);

	const toggleTheme = () => {
		setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
	};

	const pathHeadings = {
		'/about': 'Dashboard',
		'/service': 'Dashboard',
		'/location': 'Locations',
		'/users': 'Users',
		'/customers': 'Customers',
		'/products': 'Products',
		'/services': 'Services',
		'/allcustomers': 'Customers Report',
		'/topcustomers': 'Top Customers',
		'/productreport': 'Product Report',
		'/purchasereport': 'Service Sale Report',
		'/serviceused': 'Service Usage Report',
		'/dailyUses': 'Daily Usage Report',
	};

	const heading = pathHeadings[locationPath] || '';
	const hideSelect = [
		'/locationStep',
		'/users',
		'/location',
		'/customers',
		'/products',
		'/services',
		'/allcustomers',
		'/topcustomers',
		'/productreport',
		'/purchasereport',
		'/serviceused',
		'/dailyUses',
		'/',
	].includes(locationPath);

	return (
		<header className='top-header'>
			<div className='top-header-left'>
				{heading && <h2 className='page-heading'>{heading}</h2>}

				<select
					value={selectedLocation}
					onChange={handleLocationChange}
					className='location-select'
					style={{
						visibility: hideSelect ? 'hidden' : 'visible',
						height: hideSelect ? 0 : 'auto',
						width: hideSelect ? 0 : 'auto',
						padding: hideSelect ? 0 : 'initial',
					}}
				>
					<option value={0}>All</option>
					{filteredLocations.map((location) => (
						<option
							key={location.id}
							value={location.id}
						>
							{location?.name}
						</option>
					))}
				</select>
			</div>

			{locationPath !== '/' && (
				<div className='login-details'>
					<span className='topheadname'>
						<div className='login-user-name'>
							<FaUserCircle
								size={18}
								color='#F54291'
								style={{ marginRight: '5px' }}
							/>
							{userDetails?.profile?.firstName
								? userDetails?.profile?.firstName.charAt(0).toUpperCase() +
								  userDetails?.profile?.firstName.slice(1).toLowerCase()
								: 'User'}{' '}
							{userDetails?.profile?.lastName
								? userDetails?.profile?.lastName.charAt(0).toUpperCase() +
								  userDetails?.profile?.lastName.slice(1).toLowerCase()
								: 'User'}
						</div>

						<div className='login-user-name'>
							<IoLocationSharp
								fontSize={18}
								color='#28A745'
								style={{ marginRight: '5px' }}
								className='location-icon'
							/>
							<span>
								<strong>Curr. Loc: </strong>
								{selectedLocationName}
							</span>
						</div>
					</span>

					{/* Theme toggle button */}
					<button
						className='theme-toggle-btn'
						onClick={toggleTheme}
						style={{
							background: 'none',
							border: 'none',
							cursor: 'pointer',
							marginLeft: '15px',
						}}
					>
						<MdOutlineDarkMode
							size={24}
							color='#FFA500'
							title='Switch to Dark Mode'
							style={{ display: 'none' }} // Hide the dark mode icon
						/>
						<MdOutlineLightMode
							size={24}
							color='#000'
							title='Switch to Light Mode'
							style={{ display: 'none' }} // Hide the light mode icon
						/>
					</button>
				</div>
			)}
		</header>
	);
}

export default TopHeader;
