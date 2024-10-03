/** @format */

// AddNewCustomerModal.js
import {
	Box,
	Button,
	TextField,
	Typography,
	FormControlLabel,
	Switch,
} from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { refreshLocation } from '../../slices/locationSlice';
import { createUser } from '../../service/operations/userApi';
import { addCustomer, refreshCustomers } from '../../slices/customerProfile';

const AddCustomerModal = ({ closeAddModal }) => {
	const { token } = useSelector((state) => state.auth);
	const dispatch = useDispatch();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitSuccessful },
	} = useForm();

	const { locations, loading } = useSelector((state) => state.location);

	useEffect(() => {
		dispatch(refreshLocation());
	}, [dispatch]);

	const handleSubmitForm = async (data) => {
		try {
			const newUserData = {
				password: data.password,
				firstName: data.firstName,
				lastName: data.lastName,
				email: data.email,
				address: data.address,
				post_code: data.post_code,
				phone_number: data.phone_number,
				gender: data.gender || '',
				gdpr_sms_active: data.gdpr_sms_active || false,
				gdpr_email_active: data.gdpr_email_active || false,
				referred_by: data.referred_by || "",
				preferred_location: data.preferred_location,
				avatar: '',
				role: 'customer',
			};
			const newUser = await createUser(token, newUserData);
			if (newUser) {
				dispatch(addCustomer(newUser));
			}
			dispatch(refreshCustomers());
			closeAddModal();
		} catch (error) {
			console.error(error);
		} finally {
			closeAddModal();
		}
	};

	useEffect(() => {
		if (isSubmitSuccessful) {
			reset({
				password: '',
				firstName: '',
				lastName: '',
				email: '',
				address: '',
				post_code: '',
				phone_number: '',
				gender: '',
				referred_by: '',
				preferred_location: '',
				gdpr_sms_active: false,
				gdpr_email_active: false,
				avatar: '',
			});
		}
	}, [reset, isSubmitSuccessful]);

	return (
		<Box className='modal-container'>
			<Typography
				variant='h6'
				id='add-location-modal-title'
			>
				Add New Customer
			</Typography>
			<form onSubmit={handleSubmit(handleSubmitForm)}>
				<Box mt={2}>
					<Box className='form-row'>
						<TextField
							label='First Name'
							variant='outlined'
							{...register('firstName', { required: true })}
							fullWidth
						/>
						<TextField
							label='Last Name'
							variant='outlined'
							{...register('lastName', { required: true })}
							fullWidth
						/>
					</Box>

					<Box className='form-row'>
						<TextField
							label='Email'
							variant='outlined'
							{...register('email', { required: true })}
							fullWidth
						/>
						<TextField
							label='Phone Number'
							variant='outlined'
							{...register('phone_number', { required: true })}
							fullWidth
						/>
					</Box>

					<Box className='form-row'>
						<TextField
							label='Password'
							variant='outlined'
							{...register('password', { required: true })}
							fullWidth
						/>
					</Box>

					<Box mb={2}>
						<TextField
							label='Address'
							variant='outlined'
							{...register('address', { required: true })}
							fullWidth
						/>
					</Box>

					<Box className='form-row'>
						<TextField
							label='Post Code'
							variant='outlined'
							{...register('post_code', { required: true })}
							fullWidth
						/>
						<TextField
							label='Referred By'
							variant='outlined'
							{...register('referred_by')}
							fullWidth
						/>
					</Box>

					<Box className='form-row'>
						<select
							id='preferred_location'
							className='custom-select'
							{...register('preferred_location', { required: true })}
							disabled={loading}
						>
							<option value=''>Select location</option>
							{locations.map((location) => (
								<option
									key={location.id}
									value={location.id}
								>
									{location.name}
								</option>
							))}
						</select>

						<select
							id='gender'
							className='custom-select'
							{...register('gender', { required: true })}
						>
							<option value=''>Select gender</option>
							<option value='Male'>Male</option>
							<option value='Female'>Female</option>
							<option value='Other'>Other</option>
						</select>
					</Box>

					<Box className='switch-row'>
						<FormControlLabel
							control={
								<Switch
									{...register('gdpr_sms_active')}
									color='primary'
								/>
							}
							label='SMS'
							className='form-control-label'
						/>
						<FormControlLabel
							control={
								<Switch
									{...register('gdpr_email_active')}
									color='primary'
								/>
							}
							label='Email'
							className='form-control-label'
						/>
					</Box>
				</Box>

				<Box className='button-row'>
					<Button
						variant='contained'
						className='confirm-button'
						type='submit'
					>
						Submit
					</Button>
					<Button
						variant='contained'
						className='cancel-button'
						onClick={closeAddModal}
					>
						Cancel
					</Button>
				</Box>
			</form>
		</Box>
	);
};

export default AddCustomerModal;
