/** @format */

import React, { useEffect } from 'react'; // Import CSS for the modal
import { Box, Button, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { updateService } from '../../service/operations/serviceAndServiceTransaction';
import { refreshService } from '../../slices/serviceSlice';

const EditServiceModal = ({ activeService, closeEditModal }) => {
	const { token } = useSelector((state) => state.auth); // Assuming token is stored in auth slice
	const dispatch = useDispatch();

	const {
		register,
		handleSubmit,
		reset,
		formState: { isSubmitSuccessful },
	} = useForm();

	const handleSubmitForm = async (data) => {
		try {
			const updatedData = {
				serviceName: data.serviceName,
				price: Number(data.price),
				minutesAvailable: data.minutesAvailable,
			};
			const result = await updateService(token, activeService.id, updatedData);

			if (result) {
				dispatch(refreshService());
				closeEditModal();
			}
		} catch (error) {
			console.error('Error updating Service:', error);
		}
	};
	useEffect(() => {
		if (isSubmitSuccessful) {
			reset({
				serviceName: '',
				price: '',
				minutesAvailable: '',
			});
		}
	}, [reset, isSubmitSuccessful]);
	return (
		<Box className='edit-modal'>
			<Typography
				variant='h6'
				id='edit-location-modal-title'
			>
				Edit Service
			</Typography>

			<form onSubmit={handleSubmit(handleSubmitForm)}>
				<Box mt={2}>
					<TextField
						label='Name'
						fullWidth
						defaultValue={activeService?.serviceName}
						{...register('serviceName', { required: true })}
					/>
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
							label='Price'
							fullWidth
							defaultValue={activeService?.price}
							{...register('price', { required: true })}
						/>
						<TextField
							label='Minute'
							fullWidth
							defaultValue={activeService?.minutesAvailable}
							{...register('minutesAvailable', { required: true })}
						/>
					</Box>
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

export default EditServiceModal;
