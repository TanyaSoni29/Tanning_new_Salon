/** @format */

import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import './UseServiceModal.css'; // Import the separate CSS file

function UseServiceModal({
	onClose,
	serviceUseOptions,
	createServiceUseTransactionOfUser,
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

	console.log(serviceUseOptions);

	const uniqueServiceOptions = serviceUseOptions?.filter(
		(service, index, self) =>
			index === self.findIndex((s) => s.service_id === service.service_id)
	);

	return (
		<Box className='use-service-modal-container'>
			<div className='modal-header'>
				<Typography
					variant='h6'
					color='white'
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
					{uniqueServiceOptions?.length > 0 &&
						uniqueServiceOptions.map((service) => (
							<option
								key={service?.service_id}
								value={service?.service_id}
							>
								{service?.serviceName}
							</option>
						))}
				</select>
			</div>

			<div className='modal-actions'>
				<button
					variant='contained'
					onClick={handleUseService}
					className='confirm-button'
				>
					Use Service
				</button>
				<button
					variant='contained'
					className='cancel-button'
					onClick={() => onClose()}
				>
					Cancel
				</button>
			</div>
		</Box>
	);
}

export default UseServiceModal;
