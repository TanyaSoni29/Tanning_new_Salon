/** @format */

import React, { useEffect } from 'react'; // Import CSS for the modal
import { Box, Button, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { updateProduct } from '../../service/operations/productAndProductTransaction';
import { refreshProduct } from '../../slices/productSlice';

const EditProductModal = ({ activeProduct, closeEditModal }) => {
	const { token } = useSelector((state) => state.auth); // Assuming token is stored in auth slice
	const dispatch = useDispatch();

	const {
		register,
		handleSubmit,
		reset,
		formState: { isSubmitSuccessful },
	} = useForm({
		defaultValues: {
			name: activeProduct.name,
			price: activeProduct.price,
		},
	});

	const handleSubmitForm = async (data) => {
		try {
			const updatedData = {
				name: data.name,
				price: data.price,
			};
			const result = await updateProduct(
				token,
				activeProduct.id,
				updatedData
			);

			if (result) {
				dispatch(refreshProduct());
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
				price: '',
			});
		}
	}, [reset, isSubmitSuccessful]);
	return (
		<Box className='edit-modal'>
			<Typography
				variant='h6'
				id='edit-location-modal-title'
			>
				Edit Product
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
						label='Price'
						fullWidth
						{...register('price', { required: true })}
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

export default EditProductModal;
