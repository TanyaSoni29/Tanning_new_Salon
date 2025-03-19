/** @format */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LocationStep.css'; // Import the new CSS file
import { useDispatch, useSelector } from 'react-redux';
import { refreshLocation, setLocationIndex } from '../slices/locationSlice';
import { refreshUser } from '../slices/userProfileSlice';
import { IoLocationSharp } from 'react-icons/io5';

const WizardStep = ({
	setSelectedLoginLocation,
	selectedLoginLocation,
	handleLoginLocationChange,
}) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const { locations, loading, locationIndex } = useSelector(
		(state) => state.location
	);
	const { signupData } = useSelector((state) => state.auth);

	// Find the logged-in user's details
	// const userDetails = users?.find((user) => user?.user?.id === loginUser?.id);
	const preferredLocationId = signupData?.locationId;

	const filteredLocations = locations.filter((location) => location.isActive);

	useEffect(() => {
		// Fetch locations and user details from the API
		dispatch(refreshLocation());
	}, [dispatch]);

	useEffect(() => {
		// Set the preferred location as selected if it exists and locations have loaded
		if (locations.length > 0 && preferredLocationId) {
			setSelectedLoginLocation(preferredLocationId);
			dispatch(setLocationIndex(preferredLocationId)); // Set the location index in Redux
		}
	}, [locations, preferredLocationId, dispatch, setSelectedLoginLocation]);

	const handleNextLocation = () => {
		navigate('/about');
	};

	// const selectLocation = (locationId) => {
	// 	setSelectedLoginLocation(locationId);
	// 	dispatch(setLocationIndex(locationId)); // Update Redux state with the selected location
	// };

	return (
		<>
			<div className='location-wizard-container'>
				{/* <h2 className='heading'>Tanning Salon</h2>
				<p className='subheading'>
					This information will let us know about your working location.
				</p> */}

				<div
					className='location-selection'
					id='location'
				>
					<div className='location-heading-icon'>
						<h3 className='select-heading'>
							<IoLocationSharp
								fontSize={24}
								color='#28A745'
								style={{ marginRight: '2px' }}
								// className='location-icon'
								// onClick={() => setMenuOpen((prev) => !prev)}
							/>
						</h3>

						<h3 className='select-heading'>Select Your Location</h3>
					</div>

					<p className='subheading'>Which location are you working at</p>
					{loading ? (
						<p>Loading locations...</p>
					) : (
						<div className='locations'>
							{/* Render locations from Redux */}
							{/* {locations.map((location) => (
								<div
									key={location.id}
									className={`location ${
										locationIndex === location.id ? 'selected' : ''
									}`}
									onClick={() => selectLocation(location.id)}
								>
									<i
										className='fa fa-laptop'
										aria-hidden='true'
									></i>
									<span>{location.name}</span>
								</div>
							))} */}

							<select
								value={selectedLoginLocation}
								onChange={handleLoginLocationChange}
							>
								{filteredLocations.map((location) => (
									<option
										key={location.id}
										value={location.id}
									>
										{location.name}
									</option>
								))}
							</select>
						</div>
					)}

					<button
						className='next-button1'
						onClick={handleNextLocation}
					>
						Continue
					</button>
				</div>
			</div>
		</>
	);
};

export default WizardStep;
