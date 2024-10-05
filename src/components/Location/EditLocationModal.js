/** @format */

import React, { useEffect } from 'react'; // Import CSS for the modal
import { Box, Button, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { updateLocation } from '../../service/operations/locationApi';
import { refreshLocation } from '../../slices/locationSlice';

const EditLocationModal = ({ activeLocation, closeEditModal }) => {
	const { token } = useSelector((state) => state.auth); // Assuming token is stored in auth slice
	const dispatch = useDispatch();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitSuccessful },
	} = useForm({
		defaultValues: {
			name: activeLocation.name,
			address: activeLocation.address,
			phone_number: activeLocation.phone_number,
			post_code: activeLocation.post_code,
		},
	});

	const handleSubmitForm = async (data) => {
		try {
			const updatedData = {
				name: data.name,
				address: data.address,
				phone_number: data.phone_number,
				post_code: data.post_code,
			};
			const result = await updateLocation(
				token,
				activeLocation.id,
				updatedData
			);

			if (result) {
				dispatch(refreshLocation());
				closeEditModal();
			}
		} catch (error) {
			console.error('Error updating location:', error);
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
		<Box className='edit-modal'>
			<Typography
				variant='h6'
				id='edit-location-modal-title'
			>
				Edit Location
			</Typography>

			<form onSubmit={handleSubmit(handleSubmitForm)}>
				<Box
					mt={2}
					sx={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						gap: 2,
					}}
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
						helperText={errors.phone_number ? errors.phone_number.message : ''}
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
						onClick={closeEditModal}
						className='cancel-button'
					>
						Cancel
					</Button>
				</Box>
			</form>
		</Box>
	);
};

export default EditLocationModal;
