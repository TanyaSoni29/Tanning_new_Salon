/** @format */

import React, { useEffect } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { createService } from '../../service/operations/serviceAndServiceTransaction'; // Ensure you have an API call for adding a Service
import { addService, refreshService } from '../../slices/serviceSlice';

const AddServiceModal = ({ closeAddModal }) => {
	const { token } = useSelector((state) => state.auth); // Assuming token is stored in auth slice
	const dispatch = useDispatch();

	const {
		register,
		handleSubmit,
		reset,
		formState: { isSubmitSuccessful },
	} = useForm({
		defaultValues: {
			name: '',
			price: '',
			minute: '',
		},
	});

	const handleSubmitForm = async (data) => {
		try {
			const newService = {
				name: data.name,
				price: data.price,
				minute: data.minute,
			};
			const result = await createService(token, newService);
			if (result) {
				dispatch(addService(result));
				dispatch(refreshService()); // Refresh Services after adding
				closeAddModal(); // Close the modal after successful submission
			}
		} catch (error) {
			console.error('Error adding new Service:', error);
		}
	};

	useEffect(() => {
		if (isSubmitSuccessful) {
			reset({
				name: '',
				price: '',
				minute: '',
			});
		}
	}, [reset, isSubmitSuccessful]);

	return (
		<div className='add-modal-overlay'>
			<Box className='add-modal'>
				<Typography
					variant='h6'
					id='add-Service-modal-title'
				>
					Add New Service
				</Typography>

				<form onSubmit={handleSubmit(handleSubmitForm)}>
					<Box
						mt={2}
						display='flex'
						gap={2}
					>
						<TextField
							label='Name'
							fullWidth
							{...register('name', { required: true })}
						/>
						<TextField
							label='Price'
							fullWidth
							{...register('price', { required: true })}
						/>
						<TextField
							label='Minute'
							fullWidth
							{...register('minute', { required: true })}
						/>
					</Box>

					<Box
						mt={2}
						display='flex'
						justifyContent='space-between'
					>
						<Button
							variant='contained'
							type='submit'
							className='confirm-button'
						>
							Submit
						</Button>
						<Button
							variant='outlined'
							onClick={closeAddModal}
							className='cancel-button'
						>
							Cancel
						</Button>
					</Box>
				</form>
			</Box>
		</div>
	);
};

export default AddServiceModal;
