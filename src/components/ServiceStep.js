/** @format */

// ServiceStep.js

import React from 'react';
import HeaderWithSidebar from './HeaderWithSidebar';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

const ServiceStep = () => {
	const navigate = useNavigate();
	const { customer } = useSelector((state) => state.customer); // Access the selected customer
	console.log(customer);
	return (
		<>
			<HeaderWithSidebar />
			<div className='wizard-container'>
				<h2 className='heading'>Tanning Salon</h2>

				<div className='step-tabs'>
					<button
						onClick={() => navigate('/locationStep')}
						className='tab'
					>
						LOCATION
					</button>
					<button className='tab'>ABOUT</button>
					<button className='tab active'>SERVICE</button>
				</div>

				{/* Display the selected customer information */}
				<div className='service-info'>
					<h3 className='info-heading'>Selected Customer</h3>
					{customer ? (
						<div>
							<p>Name: {customer.user.name}</p>
							<p>Phone Number: {customer.profile?.phone_number}</p>
							<p>Gender: {customer.profile?.gender}</p>
							<p>Available Balance: {customer.profile?.available_balance}</p>
							<p>Total Spend: {customer.profile?.total_spend}</p>
						</div>
					) : (
						<p>No customer selected</p>
					)}
				</div>

				<button className='submit-button'>Submit</button>
			</div>
		</>
	);
};

export default ServiceStep;
