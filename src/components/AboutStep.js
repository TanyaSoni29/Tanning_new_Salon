/** @format */

import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AboutStep.css'; // Ensure this CSS file is imported
import HeaderWithSidebar from './HeaderWithSidebar';
import { useDispatch, useSelector } from 'react-redux';
import CustomerOverview from './CustomerOverview';
import AddCustomerModal from './Customers/AddCustomerModal';
import Modal from '../components/Modal';
import { refreshCustomers } from '../slices/customerProfile';
import { refreshLocation } from '../slices/locationSlice';
import { refreshUser } from '../slices/userProfileSlice';
import StatsHeader from './StatsHeader';
import TopHeader from './TopHeader';
import { getStats } from '../service/operations/statApi';

const AboutStep = ({
	stats,
	setStats,
	selectedLocation,
	// setSelectedLocation,
  selectedLoginLocation
}) => {
	const navigate = useNavigate();
	const { customers } = useSelector((state) => state.customer);
	// const { locations } = useSelector((state) => state.location);
	const [isAddOpen, setIsAddOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const { token } = useSelector((state) => state.auth);
	// const [isAllLocation, setIsAllLocation] = useState(false);

	// const [selectedLocation, setSelectedLocation] = useState(0);
	const dispatch = useDispatch();
	const searchRef = useRef(null);

	useEffect(() => {
		async function stats() {
			try {
				const response = await getStats(token, selectedLocation);
				// const response = await getStats(token, 0);
				// console.log('Stats:', response);
				setStats(response.data);
			} catch (error) {
				console.error('Failed to fetch stats:', error);
			}
		}
		stats();
	}, [selectedLocation, dispatch, token]);

	useEffect(() => {
		dispatch(refreshCustomers());
		dispatch(refreshLocation());
		dispatch(refreshUser());
	}, [dispatch]);

	// Filter customers based on location and search query
	// const filteredCustomers =
	//   selectedLocation === 0
	//     ? customers
	//     : customers
	//         .filter(
	//           (user) => user.profile?.preferred_location === selectedLocation
	//         )
	//         .filter(
	//           (user) =>
	//             user.profile?.firstName
	//               .toLowerCase()
	//               .includes(searchQuery.toLowerCase()) ||
	//             (user.profile?.phone_number &&
	//               user.profile.phone_number
	//                 .toLowerCase()
	//                 .includes(searchQuery.toLowerCase())) ||
	//             (user.user?.email &&
	//               user.user?.email
	//                 .toLowerCase()
	//                 .includes(searchQuery.toLowerCase()))
	//         );

	// const filteredCustomers = customers
	// 	.filter((user) => {
	// 		// If a location is selected, filter by location
	// 		// if (isAllLocation) {
	// 		// 	return (
	// 		// 		user.profile?.preferred_location === selectedLocation ||
	// 		// 		user.profile?.preferred_location === 0
	// 		// 	);
	// 		// }

	// 		if (selectedLocation !== 0) {
	// 			return user.profile?.preferred_location === selectedLocation;
	// 		}
	// 		// If no location is selected, return all users
	// 		return true;
	// 	})
	// 	.filter((user) => {
	// 		// Filter by search query if provided
	// 		return (
	// 			user.profile?.firstName
	// 				.toLowerCase()
	// 				.includes(searchQuery.toLowerCase()) ||
	// 			(user.profile?.phone_number &&
	// 				user.profile.phone_number
	// 					.toLowerCase()
	// 					.includes(searchQuery.toLowerCase())) ||
	// 			(user.user?.email &&
	// 				user.user?.email.toLowerCase().includes(searchQuery.toLowerCase()))
	// 		);
	// 	});

	const filteredCustomers = searchQuery
		? customers?.filter((user) => {
				// Filter by search query if provided
				return (
					user.profile?.firstName
						?.toLowerCase()
						.includes(searchQuery.toLowerCase()) ||
					user.profile?.lastName
						?.toLowerCase()
						.includes(searchQuery.toLowerCase()) || // Added lastName filter
					(user.profile?.phone_number &&
						user.profile.phone_number
							.toLowerCase()
							.includes(searchQuery.toLowerCase())) ||
					(user.user?.email &&
						user.user.email.toLowerCase().includes(searchQuery.toLowerCase()))
				);
		  })
		: [];

	// console.log(customers, selectedLocation);

	const handleKeyPress = (event) => {
		if (event.key === 'Enter') {
			searchRef.current.blur();
		}
	};

	const handleClearFilters = () => {
		// setIsAllLocation(false);
		// setSelectedLocation(0);
		setSearchQuery('');
	};

	// const handleLocationChange = (e) => {
	//   setSelectedLocation(Number(e.target.value));
	// };

	return (
		<>
			<HeaderWithSidebar />
			<StatsHeader stats={stats} />
			<div className='wizard-container'>
				<div className='filter-container'>
					{/* Location Dropdown */}
					{/* <select
            value={selectedLocation}
            onChange={handleLocationChange}
            className="location-select"
          >
            <option value={0}>Select Location</option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location?.name}
              </option>
            ))}
          </select> */}

					{/* Search Input */}
					{/* <div className='dashboard-toggle-container'>
						<span className='dashtoggle'>All</span>
						<label className='switch'>
							<input
								type='checkbox'
								checked={isAllLocation}
								onChange={(e) => setIsAllLocation(e.target.checked)}
							/>
							<span className='slider round'></span>
						</label>
					</div> */}
					<input
						type='text'
						className='search-input'
						value={searchQuery}
						onKeyPress={handleKeyPress}
						ref={searchRef}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder='Search Customer'
					/>

					{/* Search Button */}
					<button className='search-button'>Search</button>

					{/* Clear Filter Button */}
					<button
						className='clear-button'
						onClick={handleClearFilters}
					>
						Clear Filters
					</button>

					{/* Register New Customer Button */}
					<button
						className='register-button'
						onClick={() => setIsAddOpen(true)}
					>
						Register New Customer
					</button>
				</div>

				<div>
					<CustomerOverview filteredCustomers={filteredCustomers} />
				</div>

				{isAddOpen && (
					<Modal
						setOpen={setIsAddOpen}
						open={isAddOpen}
					>
						<AddCustomerModal
							closeAddModal={() => setIsAddOpen(false)}
							selectedLoginLocation={selectedLoginLocation}
						/>
					</Modal>
				)}
			</div>
		</>
	);
};

export default AboutStep;
