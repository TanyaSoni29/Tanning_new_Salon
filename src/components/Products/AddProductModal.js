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

	const {
		register,
		handleSubmit,
		reset,
		formState: { isSubmitSuccessful },
	} = useForm({
		defaultValues: {
			name: '',
			price: '',
			stock: '',
		},
	});

	const handleSubmitForm = async (data) => {
		try {
			const newLocation = {
				name: data.name,
				price: Number(data.price),
				stock: Number(data.stock),
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
				stock: '',
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
							{...register('stock', { required: true })}
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
