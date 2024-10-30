/** @format */

import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import './UseServiceModal.css'; // Import the separate CSS file

function UseServiceModal({
	onClose,
	serviceUseOptions,
	createServiceUseTransactionOfUser,
	availableBalance,
}) {
	const [selectedService, setSelectedService] = useState('');

	const handleServiceChange = (event) => {
		setSelectedService(Number(event.target.value)); // Update the selected service state
	};

	const handleUseService = () => {
		if (selectedService) {
			createServiceUseTransactionOfUser(selectedService); // Call the transaction creation method
			onClose(); // Close modal after service is used
		} else {
			alert('Please select a service before using.'); // Alert if no service is selected
		}
	};

	// Sorting and filtering the services
	const filteredServiceOptions = serviceUseOptions
		?.slice() // Create a shallow copy to avoid mutating the original array
		.sort((a, b) => a.minutesAvailable - b.minutesAvailable); // Sort by minutesAvailable in ascending order

	// console.log('Filtered and sorted services:', filteredServiceOptions);

	return (
		<Box className='use-service-modal-container'>
			<div className='modal-header'>
				<Typography
					variant='h6'
					color='black'
				>
					Select a Service to Use
				</Typography>
			</div>

			<div className='modal-body'>
				<select
					id='service-select'
					value={selectedService}
					onChange={handleServiceChange}
					className='service-select'
				>
					<option
						value=''
						disabled
					>
						Select Service
					</option>
					{filteredServiceOptions?.length > 0 &&
						filteredServiceOptions.map((service) => (
							<option
								key={service?.id}
								value={service?.id}
								disabled={Number(service?.minutesAvailable) > availableBalance} // Disable if required minutes exceed available balance
							>
								{service?.serviceName}{' '}
								{Number(service?.minutesAvailable) > availableBalance
									? '(Insufficient balance)'
									: ''}
							</option>
						))}
				</select>
			</div>

			<div className='modal-actions'>
				<button
					variant='contained'
					className='cancel-button'
					onClick={() => onClose()}
				>
					Cancel
				</button>
				<button
					variant='contained'
					onClick={handleUseService}
					className='confirm-button'
				>
					Use Service
				</button>
			</div>
		</Box>
	);
}

export default UseServiceModal;
