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
			serviceName: '',
			price: '',
			minutesAvailable: '',
		},
	});

	const handleSubmitForm = async (data) => {
		try {
			const newService = {
				serviceName: data.serviceName,
				price: Number(data.price),
				minutesAvailable: data.minutesAvailable,
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
				serviceName: '',
				price: '',
				minutesAvailable: '',
			});
		}
	}, [reset, isSubmitSuccessful]);

	return (
		<div className='add-modal-overlay'>
			<Box sx={{ backgroundColor: 'var(--modal--formbg)', }} className='add-modal'>
				<Typography
					variant='h6'
					id='add-location-modal-title'
					color='white'
				>
					Add New Service
				</Typography>

				<form onSubmit={handleSubmit(handleSubmitForm)}>
					<Box  mt={2}>
						<TextField
							label='Name'
							fullWidth
							{...register('serviceName', { required: true })}
							InputLabelProps={{
								style: { color: 'var(--modal--formbgtextcol)' }, // Label color
							}}
							InputProps={{
								style: { color: 'var(--modal--formbgtextcol)' }, // Input text color
							}}
						/>
						<Box
							mt={2}
							display='flex'
							gap={2}
						>
							<TextField
								label='Price'
								fullWidth
								{...register('price', { required: true })}
								InputLabelProps={{
									style: { color: 'var(--modal--formbgtextcol)' }, // Label color
								}}
								InputProps={{
									style: { color: 'var(--modal--formbgtextcol)' }, // Input text color
								}}
							/>
							<TextField
								label='Minute'
								fullWidth
								{...register('minutesAvailable', { required: true })}
								InputLabelProps={{
									style: { color: 'var(--modal--formbgtextcol)' }, // Label color
								}}
								InputProps={{
									style: { color: 'var(--modal--formbgtextcol)' }, // Input text color
								}}
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
