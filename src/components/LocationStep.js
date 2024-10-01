/** @format */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './LocationStep.css'; // Import the new CSS file
import HeaderWithSidebar from './HeaderWithSidebar';
import { useDispatch, useSelector } from 'react-redux';
import { refreshLocation, setLocationIndex } from '../slices/locationSlice';
import { refreshCustomers } from '../slices/customerProfile';
const WizardStep = () => {
	const navigate = useNavigate();
	const location = useLocation(); // Get the current location
	const dispatch = useDispatch();

	const { locations, loading, locationIndex } = useSelector(
		(state) => state.location
	);
	// State to track the current step
	const [currentStep, setCurrentStep] = useState('location'); // Default to "location"
	useEffect(() => {
		dispatch(refreshLocation()); // Fetch locations from the API
	}, [dispatch]);

	useEffect(() => {
		dispatch(refreshCustomers());
	}, [dispatch]);
	// Set the current step based on the URL path
	useEffect(() => {
		if (location.pathname === '/about') {
			setCurrentStep('about');
		} else if (location.pathname === '/service') {
			setCurrentStep('service');
		} else {
			setCurrentStep('location');
		}
	}, [location.pathname]);

	const handleTabClick = (step) => {
		setCurrentStep(step); // Change the current step based on the clicked tab
		navigate(step === 'location' ? '/locationStep' : `/${step}`); // Navigate based on step
	};

	const handleNextLocation = () => {
		setCurrentStep('about');
		navigate('/about');
	};

	// const handleNextAbout = () => {
	// 	setCurrentStep('service');
	// 	navigate('/service');
	// };

	const handlePreviousAbout = () => {
		setCurrentStep('location');
		navigate('/locationStep');
	};

	const handleSubmit = () => {
		alert('Form Submitted');
	};

	const selectLocation = (locationId) => {
		dispatch(setLocationIndex(locationId)); // Set selected location index in Redux
	};

	return (
		<>
			<HeaderWithSidebar />

			<div className='wizard-container'>
				<h2 className='heading'>Tanning Salon</h2>
				<p className='subheading'>
					This information will let us know more about you.
				</p>

				{/* Step Tabs */}
				<div className='step-tabs'>
					<button
						className={`tab ${currentStep === 'location' ? 'active' : ''}`}
						onClick={() => handleTabClick('location')}
					>
						LOCATION
					</button>
					<button
						className={`tab ${currentStep === 'about' ? 'active' : ''}`}
						onClick={() => handleTabClick('about')}
					>
						ABOUT
					</button>
					<button
						className={`tab ${currentStep === 'service' ? 'active' : ''}`}
						// onClick={() => handleTabClick('service')}
					>
						SERVICE
					</button>
				</div>

				{/* Conditionally Render Sections Based on Current Step */}
				{currentStep === 'location' && (
					<div
						className='location-selection'
						id='location'
					>
						<h3 className='select-heading'>Select Your Location</h3>
						{loading ? (
							<p>Loading locations...</p>
						) : (
							<div className='locations'>
								{/* Render locations from Redux */}
								{locations.map((location) => (
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
								))}
							</div>
						)}

						<button
							className='next-button1'
							onClick={handleNextLocation}
						>
							Next
						</button>
					</div>
				)}
			</div>
		</>
	);
};

export default WizardStep;
