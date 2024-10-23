/** @format */

import React, { useEffect } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct } from '../../service/operations/productAndProductTransaction'; // Ensure you have an API call for adding a location
import { addProduct, refreshProduct } from '../../slices/productSlice';

const AddProductModal = ({ closeAddModal, selectedLoginLocation }) => {
	const { token } = useSelector((state) => state.auth); // Assuming token is stored in auth slice
	const dispatch = useDispatch();
	const { locations } = useSelector((state) => state.location);

	const locationDetails = locations.find(
		(location) => location.id === selectedLoginLocation
	);

	// For example, if locationDetails.location_id is '01', it maps to 'stock01'
	const stockField = `stock${locationDetails?.location_id}`;

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitSuccessful },
	} = useForm({
		defaultValues: {
			name: '',
			price: '',
			[stockField]: '',
		},
	});

	const handleSubmitForm = async (data) => {
		try {
			const newLocation = {
				name: data.name,
				price: Number(data.price),
				[stockField]: Number(data[stockField]) || 0,
			};
			const result = await createProduct(token, newLocation);
			if (result) {
				dispatch(addProduct(result));
				dispatch(refreshProduct()); // Refresh Products after adding
				closeAddModal(); // Close the modal after successful submission
			}
		} catch (error) {
			console.error('Error adding new Product:', error);
		}
	};

	useEffect(() => {
		if (isSubmitSuccessful) {
			reset({
				name: '',
				price: '',
				[stockField]: '',
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
					Add New Product
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
					</Box>

					<Box
						mt={2}
						display='flex'
						gap={2}
					>
						<TextField
							label='Price'
							fullWidth
							{...register('price', { required: true })}
						/>
						<TextField
							label='Stock'
							fullWidth
							{...register(stockField, {
								required: 'Stock is required',
								min: { value: 0, message: 'Stock must be at least 0' },
								valueAsNumber: true,
							})}
							defaultValue={0}
							error={!!errors[stockField]}
							helperText={errors[stockField] ? errors[stockField].message : ''}
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

export default AddProductModal;
