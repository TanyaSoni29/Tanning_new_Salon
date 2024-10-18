import React, { useEffect } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { createLocation } from '../../service/operations/locationApi'; // Ensure you have an API call for adding a location
import { addLocation, refreshLocation } from '../../slices/locationSlice';

const AddLocationModal = ({ closeAddModal }) => {
	const { token } = useSelector((state) => state.auth); // Assuming token is stored in auth slice
	const dispatch = useDispatch();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitSuccessful },
	} = useForm({
		defaultValues: {
			name: '',
			address: '',
			phone_number: '',
			post_code: '',
		},
	});

	const handleSubmitForm = async (data) => {
		try {
			const newLocation = {
				name: data.name,
				address: data.address,
				phone_number: data.phone_number,
				post_code: data.post_code,
			};
			const result = await createLocation(token, newLocation);
			if (result) {
				dispatch(addLocation(result));
				dispatch(refreshLocation()); // Refresh locations after adding
				closeAddModal(); // Close the modal after successful submission
			}
		} catch (error) {
			console.error('Error adding new location:', error);
		}
	};

	useEffect(() => {
		if (isSubmitSuccessful) {
			reset({
				name: '',
				address: '',
				post_code: '',
				phone_number: '',
			});
		}
	}, [reset, isSubmitSuccessful]);

	return (
		<div className='add-modal-overlay'>
			<Box className='add-modal'>
				<Typography
					variant='h6'
					id='add-location-modal-title'
				>
					Add New Location
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
							label='Phone Number'
							{...register('phone_number', {
								required: 'Phone number is required',
								pattern: {
									value: /^[0-9]{10,15}$/, // Example: accept numbers of length 10 to 15
									message: 'Phone number must be between 10 to 15 digits',
								},
							})}
							fullWidth
							error={!!errors.phone_number}
							helperText={
								errors.phone_number ? errors.phone_number.message : ''
							}
						/>
					</Box>

					<Box mt={2}>
						<TextField
							label='Address'
							fullWidth
							{...register('address', { required: true })}
							error={!!errors.address}
							helperText={errors.address ? errors.address.message : ''}
						/>
					</Box>

					<Box mt={2}>
						<TextField
							label='Post Code'
							fullWidth
							{...register('post_code', { required: true })}
							error={!!errors.post_code}
							helperText={errors.post_code ? errors.post_code.message : ''}
						/>
					</Box>

					<Box
						mt={2}
						display='flex'
						justifyContent='end'
						gap={2}
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

export default AddLocationModal;
