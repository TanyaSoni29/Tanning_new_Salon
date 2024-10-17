import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import './CreditModal.css'; // You can create a similar CSS file for CreditModal styles

function CreditModal({ onClose, addMinutes }) {
	const [enteredMinutes, setEnteredMinutes] = useState('');
	const [error, setError] = useState('');

	// Handle input change for minutes
	const handleMinutesChange = (event) => {
		const minutes = event.target.value;

		// Check if the value is within the valid range (1 to 999)
		if (minutes >= 1 && minutes <= 999) {
			setEnteredMinutes(minutes);
			setError(''); // Clear any previous error
		} else {
			setError('Please enter a valid number between 1 and 999.');
		}
	};

	// Handle adding minutes (credit)
	const handleAddMinutes = () => {
		const minutes = Number(enteredMinutes);
		if (minutes >= 1 && minutes <= 999) {
			addMinutes(minutes); // Call the function to add the minutes
			onClose(); // Close the modal
		} else {
			setError('Please enter a valid number between 1 and 999.');
		}
	};

	return (
		<Box className='credit-modal-container'>
			<div className='modal-header'>
				<Typography variant='h6' color='black'>
					Enter Minutes
				</Typography>
			</div>
			<div className='modal-body'>
				<input
					type='number'
					value={enteredMinutes}
					onChange={handleMinutesChange}
					className='minutes-input'
					placeholder='Enter number of minutes'
					min="1"
					max="999"
				/>
				{error && <Typography color='error'>{error}</Typography>}
			</div>
			<div className='modal-actions'>
				<Button
					onClick={handleAddMinutes}
					className='confirm-button'
					variant='contained'
					color='primary'
				>
					Add Minutes
				</Button>
				<Button
					className='cancel-button'
					onClick={onClose}
					variant='outlined'
				>
					Cancel
				</Button>
			</div>
		</Box>
	);
}

export default CreditModal;
