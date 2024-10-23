/** @format */

import React, { useState, useEffect } from 'react';
import {
	Box,
	Button,
	TextField,
	Typography,
	FormControlLabel,
	Switch,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { refreshLocation } from '../../slices/locationSlice';
import { createUser } from '../../service/operations/userApi';
import { addCustomer, refreshCustomers } from '../../slices/customerProfile';
import './AddCustomer.css';

const AddCustomerModal = ({ closeAddModal, selectedLoginLocation }) => {
	const { token, user: loggedInUser } = useSelector((state) => state.auth);
	const { users } = useSelector((state) => state.userProfile);
	const { locations, loading } = useSelector((state) => state.location);
	const dispatch = useDispatch();
	const [showPassword, setShowPassword] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const {
		register,
		handleSubmit,
		reset,
		setValue,
		setFocus,
		formState: { errors, isSubmitSuccessful },
	} = useForm({
		defaultValues: {
			password: '123456',
		},
	});

	const filteredLocations = locations.filter((location) => location.isActive);

	useEffect(() => {
		dispatch(refreshLocation());
	}, [dispatch]);

	const userDetails = users.find((user) => user.user.id === loggedInUser?.id);
	const preferredLocationId = userDetails?.profile?.preferred_location;

	useEffect(() => {
		if (selectedLoginLocation) {
			setValue('preferred_location', selectedLoginLocation);
		}
	}, [selectedLoginLocation, setValue]);

	const handleSubmitForm = async (data) => {
		try {
			setIsSubmitting(true);
			const newUserData = {
				password: data.password,
				firstName: data.firstName,
				lastName: data.lastName,
				email: data.email,
				address: data.address || '',
				post_code: data.post_code || '',
				phone_number: data.phone_number,
				gender: data.gender || '',
				dob: data.dob || '',
				gdpr_sms_active: data.gdpr_sms_active || false,
				gdpr_email_active: data.gdpr_email_active || false,
				referred_by: data.referred_by || '',
				preferred_location: data.preferred_location || preferredLocationId || 0,
				avatar: '',
				role: 'customer',
			};

			const newUser = await createUser(token, newUserData);
			if (newUser) {
				dispatch(addCustomer(newUser));
				dispatch(refreshCustomers());
				closeAddModal();
				reset(); // Reset form fields only on success
			}
		} catch (error) {
			console.error('Error adding customer:', error);
			if (error?.response?.data?.message?.includes('email')) {
				setFocus('email');
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	// useEffect(() => {
	// 	if (isSubmitSuccessful) {
	// 		reset({
	// 			password: '123456',
	// 			firstName: '',
	// 			lastName: '',
	// 			email: '',
	// 			address: '',
	// 			post_code: '',
	// 			phone_number: '',
	// 			gender: '',
	// 			dob: '',
	// 			referred_by: '',
	// 			preferred_location: '',
	// 			gdpr_sms_active: false,
	// 			gdpr_email_active: false,
	// 			avatar: '',
	// 		});
	// 	}
	// }, [reset, isSubmitSuccessful]);

	return (
		<Box className='addCustomer-modal-container'>
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
							{...register('firstName', {
								required: 'First name is required',
								maxLength: {
									value: 100,
									message: 'First name cannot exceed 100 characters',
								},
							})}
							fullWidth
							error={!!errors.firstName}
							helperText={errors.firstName ? errors.firstName.message : ''}
						/>
						<TextField
							label='Last Name'
							variant='outlined'
							{...register('lastName', {
								required: 'Last name is required',
								maxLength: {
									value: 100,
									message: 'Last name cannot exceed 100 characters',
								},
							})}
							fullWidth
							error={!!errors.lastName}
							helperText={errors.lastName ? errors.lastName.message : ''}
						/>
					</Box>

					<Box className='form-row'>
						<TextField
							label='Email'
							variant='outlined'
							{...register('email')}
							fullWidth
							error={!!errors.email}
							helperText={errors.email ? errors.email.message : ''}
						/>
						<TextField
							label='Phone Number'
							variant='outlined'
							{...register('phone_number')}
							fullWidth
							error={!!errors.phone_number}
							helperText={
								errors.phone_number ? errors.phone_number.message : ''
							}
						/>
					</Box>

					<Box mb={2}>
						<TextField
							label='Date of Birth'
							type='date'
							InputLabelProps={{ shrink: true }}
							{...register('dob', { required: true })}
							fullWidth
							error={!!errors.dob}
							helperText={errors.dob ? errors.dob.message : ''}
						/>
					</Box>

					<Box className='form-row'>
						<TextField
							label='Address'
							variant='outlined'
							{...register('address')}
							fullWidth
							error={!!errors.address}
							helperText={errors.address ? errors.address.message : ''}
						/>
					</Box>

					<Box className='form-row'>
						<TextField
							label='Post Code'
							variant='outlined'
							{...register('post_code')}
							fullWidth
							error={!!errors.post_code}
							helperText={errors.post_code ? errors.post_code.message : ''}
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
							{...register('preferred_location')}
							disabled={loading}
						>
							{filteredLocations?.map((location) => (
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
							{...register('gender')}
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
						/>
						<FormControlLabel
							control={
								<Switch
									{...register('gdpr_email_active')}
									color='primary'
								/>
							}
							label='Email'
						/>
					</Box>
				</Box>

				<Box className='button-row'>
					<Button
						variant='contained'
						className='confirm-button'
						type='submit'
						disabled={isSubmitting}
					>
						{isSubmitting ? 'Submitting...' : 'Submit'}
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
