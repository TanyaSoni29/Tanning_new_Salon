/** @format */

import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import './CreditModal.css'; // You can create a similar CSS file for CreditModal styles
import { addMinutesToService } from '../service/operations/serviceAndServiceTransaction';
import { useDispatch, useSelector } from 'react-redux';
import { refreshCustomers } from '../slices/customerProfile';

function CreditModal({ onClose, customer }) {
	const [enteredMinutes, setEnteredMinutes] = useState();
	const [error, setError] = useState('');
	const { token } = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	// Handle input change for minutes
	const handleMinutesChange = (event) => {
		const minutes = event.target.value;

		// Check if the value is within the valid range (1 to 999)
		if (minutes >= 1 && minutes <= 999) {
			setEnteredMinutes(minutes);
			setError(''); // Clear any previous error
		} else {
			setError('Please enter a valid number between 1 and 999');
		}
	};

	//   console.log("-----", customer);

	// Handle adding minutes (credit)
	const handleAddMinutes = async () => {
		try {
			const minutes = Number(enteredMinutes);
			if (minutes >= 1 && minutes <= 999) {
				const data = {
					user_id: customer?.user.id,
					available_balance: minutes,
				};
				const response = await addMinutesToService(token, data);
				dispatch(refreshCustomers());
				// console.log(response); // Call the function to add the minutes
				onClose(); // Close the modal
			} else {
				setError('Please enter a valid number between 1 and 999.');
			}
		} catch (error) {}
	};

	return (
		<Box className='credit-modal-container'>
			<div className='modal-header'>
				<Typography
					variant='h6'
					color='white'
				>
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
					min='1'
					max='999'
				/>
				{error && <Typography color='error'>{error}</Typography>}
			</div>
			<div className='modal-actions'>
				<Button
					id='credit-cancel-button'
					onClick={onClose}
					variant='outlined'
				>
					Cancel
				</Button>
				<Button
					onClick={handleAddMinutes}
					id='credit-confirm-button'
					variant='contained'
					color='primary'
				>
					Add Minutes
				</Button>
			</div>
		</Box>
	);
}

export default CreditModal;
