/** @format */

import React, { useEffect } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct } from '../../service/operations/productAndProductTransaction'; // Ensure you have an API call for adding a location
import { addProduct, refreshProduct } from '../../slices/productSlice';

const AddProductModal = ({ closeAddModal }) => {
	const { token } = useSelector((state) => state.auth); // Assuming token is stored in auth slice
	const dispatch = useDispatch();
	const { locations } = useSelector((state) => state.location);
	const isStock01Active = locations.find(
		(location) => location.location_id === '01' && location.isActive
	);
	const isStock02Active = locations.find(
		(location) => location.location_id === '02' && location.isActive
	);
	const isStock03Active = locations.find(
		(location) => location.location_id === '03' && location.isActive
	);
	// const locationDetails = locations.find(
	// 	(location) => location.id === selectedLoginLocation
	// );

	// // For example, if locationDetails.location_id is '01', it maps to 'stock01'
	// const stockField = `stock${locationDetails?.location_id}`;

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitSuccessful },
	} = useForm({
		defaultValues: {
			name: '',
			price: '',
			stock01: '',
			stock02: '',
			// stock03: '',
		},
	});

	const handleSubmitForm = async (data) => {
		try {
			const newLocation = {
				name: data.name,
				price: Number(data.price),
				stock01: Number(data.stock01) || 0,
				stock02: Number(data.stock02) || 0,
				// stock03: Number(data.stock03) || 0,
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
				stock01: '',
				stock02: '',
				// stock03: '',
			});
		}
	}, [reset, isSubmitSuccessful]);

	return (
		<div className='add-modal-overlay'>
			<Box
				sx={{ backgroundColor: 'var(--modal--formbg)' }}
				className='add-modal'
			>
				<Typography
					variant='h6'
					id='add-location-modal-title'
					color='white'
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
							sx={{
								'color': 'var(--modal--formbgtextcol)', // Main TextField color
								'& .MuiInputLabel-root': {
									color: 'var(--modal--formbgtextcol)', // Label color
								},
								'& .MuiInputBase-input': {
									color: 'var(--modal--formbgtextcol)', // Input text color
								},
							}}
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
							sx={{
								'color': 'var(--modal--formbgtextcol)', // Main TextField color
								'& .MuiInputLabel-root': {
									color: 'var(--modal--formbgtextcol)', // Label color
								},
								'& .MuiInputBase-input': {
									color: 'var(--modal--formbgtextcol)', // Input text color
								},
							}}
						/>
					</Box>
					<Box
						mt={2}
						display='flex'
						gap={2}
					>
						<TextField
							label='Stock01'
							fullWidth
							{...register('stock01', {
								required: 'Stock is required',
								min: { value: 0, message: 'Stock must be at least 0' },
								valueAsNumber: true,
							})}
							disabled={!isStock01Active}
							defaultValue={0}
							error={!!errors.stock01}
							helperText={
								!isStock01Active
									? 'Location 01 is inactive'
									: errors.stock01
									? errors.stock01.message
									: ''
							}
							sx={{
								'color': 'var(--modal--formbgtextcol)', // Main TextField color
								'& .MuiInputLabel-root': {
									color: 'var(--modal--formbgtextcol)', // Label color
								},
								'& .MuiInputBase-input': {
									color: 'var(--modal--formbgtextcol)', // Input text color
								},
							}}
						/>
						<TextField
							label='Stock02'
							fullWidth
							{...register('stock02', {
								required: 'Stock is required',
								min: { value: 0, message: 'Stock must be at least 0' },
								valueAsNumber: true,
							})}
							disabled={!isStock02Active}
							defaultValue={0}
							error={!!errors.stock02}
							helperText={
								!isStock02Active
									? 'Location 02 is inactive'
									: errors.stock02
									? errors.stock02.message
									: ''
							}
							sx={{
								'color': 'var(--modal--formbgtextcol)', // Main TextField color
								'& .MuiInputLabel-root': {
									color: 'var(--modal--formbgtextcol)', // Label color
								},
								'& .MuiInputBase-input': {
									color: 'var(--modal--formbgtextcol)', // Input text color
								},
							}}
						/>
						{/* <TextField
							label='Stock03'
							fullWidth
							{...register('stock03', {
								// required: 'Stock is required',
								min: { value: 0, message: 'Stock must be at least 0' },
								valueAsNumber: true,
							})}
							disabled={!isStock03Active}
							defaultValue={0}
							error={!!errors.stock03}
							helperText={
								!isStock03Active
									? 'Location 03 is inactive'
									: errors.stock03
									? errors.stock03.message
									: ''
							}
						/> */}
					</Box>

					<Box
						mt={2}
						display='flex'
						justifyContent='flex-end'
						gap={2}
					>
						<Button
							variant='outlined'
							onClick={closeAddModal}
							className='cancel-button'
						>
							Cancel
						</Button>
						<Button
							variant='contained'
							type='submit'
							className='confirm-button'
						>
							Submit
						</Button>
					</Box>
				</form>
			</Box>
		</div>
	);
};

export default AddProductModal;
