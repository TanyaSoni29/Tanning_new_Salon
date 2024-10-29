import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import './BuyServiceModal.css'; // Importing the CSS file for styles
// import { refreshCustomers } from '../slices/customerProfile';

function BuyServiceModal({ onClose, createServiceTransactionOfUser }) {
	const [selectedService, setSelectedService] = useState('');
	const [selectedServiceDetails, setSelectedServiceDetails] = useState(null);
	const { services } = useSelector((state) => state.service);

	// Handle service selection
	const handleServiceChange = (event) => {
		const serviceId = Number(event.target.value);
		setSelectedService(serviceId);
		const service = services.find((s) => s.id === serviceId);
		setSelectedServiceDetails(service);
	};

	// Handle purchasing a service
	const handleBuyService = () => {
		if (selectedService) {
			createServiceTransactionOfUser(selectedService);
			onClose(); // Close modal after buying
		} else {
			alert('Please select a service before buying.');
		}
	};

	return (
		<Box className='service-modal-container'>
			<div className='modal-header'>
				<Typography
					variant='h6'
					color='black'
				>
					Select a Service
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
						Select a Service
					</option>
					{services
						.slice() // Create a shallow copy to avoid mutating the original array
						.sort((a, b) => a.minutesAvailable - b.minutesAvailable) // Sort by minutesAvailable in ascending order
						.map((service) => (
							<option
								key={service.id}

								
								value={service.id}
							>
								{service.serviceName}
							</option>
						))}
				</select>

				{selectedServiceDetails && (
					<div className='service-details'>
						<Typography
							variant='h6'
							fontWeight='bold'
						>
							Service Details:
						</Typography>
						<Typography variant='body1'>
							Name: {selectedServiceDetails.serviceName}
						</Typography>
						<Typography variant='body1'>
							Available Minutes: {selectedServiceDetails.minutesAvailable}
						</Typography>
						<Typography variant='body1'>
							Price: {selectedServiceDetails.price}
						</Typography>
					</div>
				)}
			</div>
			<div className='modal-actions'>
				<button
					onClick={handleBuyService}
					className='confirm-button'
				>
					Buy Service
				</button>
				<button
					className='cancel-button'
					onClick={() => onClose()}
				>
					Cancel
				</button>
			</div>
		</Box>
	);
}

export default BuyServiceModal;
