/** @format */

import React, { useState, useEffect } from 'react';
import {
	Box,
	Button,
	TextField,
	Typography,
	FormControlLabel,
	Switch,
	IconButton,
	InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { refreshLocation } from '../../slices/locationSlice';
import { createUser } from '../../service/operations/userApi';
import { addCustomer, refreshCustomers } from '../../slices/customerProfile';
import './AddCustomer.css';

const AddCustomerModal = ({ closeAddModal, selectedLoginLocation }) => {
	const { token, user: loggedInUser } = useSelector((state) => state.auth); // Get logged-in user
	const { users } = useSelector((state) => state.userProfile); // Get all users
	const { locations, loading } = useSelector((state) => state.location); // Get all locations
	const dispatch = useDispatch();
	const [showPassword, setShowPassword] = useState(false); // Password visibility toggle

	const {
		register,
		handleSubmit,
		reset,
		setValue, // To set default values
		formState: { errors, isSubmitSuccessful },
	} = useForm({
		defaultValues: {
			password: '123456', // Set default password here
		},
	});

	useEffect(() => {
		dispatch(refreshLocation()); // Fetch locations
	}, [dispatch]);

	// Find the logged-in user's details from the users array
	const userDetails = users.find((user) => user.user.id === loggedInUser?.id);

	// Extract the preferred location ID from the logged-in user's profile
	const preferredLocationId = userDetails?.profile?.preferred_location;

	// Set default location based on logged-in user's location when the component loads
	useEffect(() => {
		if (selectedLoginLocation) {
			// Set the default value for preferred_location to the logged-in user's preferred location
			setValue('preferred_location', selectedLoginLocation);
		}
	}, [selectedLoginLocation, setValue]);

	const handleSubmitForm = async (data) => {
		try {
			const newUserData = {
				password: data.password,
				firstName: data.firstName,
				lastName: data.lastName,
				email: data.email,
				address: data.address || "",
				post_code: data.post_code || "",
				phone_number: data.phone_number,
				gender: data.gender || '',
				dob: data.dob || '', // Date of Birth added
				gdpr_sms_active: data.gdpr_sms_active || false,
				gdpr_email_active: data.gdpr_email_active || false,
				referred_by: data.referred_by || '',
				preferred_location: data.preferred_location || preferredLocationId || 0, // Default to user's location
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
				password: '123456', // Resetting to default password after submission
				firstName: '',
				lastName: '',
				email: '',
				address: '',
				post_code: '',
				phone_number: '',
				gender: '',
				dob: '',
				referred_by: '',
				preferred_location: '',
				gdpr_sms_active: false,
				gdpr_email_active: false,
				avatar: '',
			});
		}
	}, [reset, isSubmitSuccessful]);

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
							{...register(
								'email'
								// {
								// 	required: 'Email is required',
								// 	pattern: {
								// 		value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
								// 		message: 'Please enter a valid email address',
								// 	},
								// }
							)}
							fullWidth
							error={!!errors.email}
							helperText={errors.email ? errors.email.message : ''}
						/>
						<TextField
							label='Phone Number'
							variant='outlined'
							{...register(
								'phone_number'
								// {
								// 	required: 'Phone number is required',
								// 	maxLength: {
								// 		value: 15,
								// 		message: 'Phone number must not exceed 15 digits',
								// 	},
								// 	pattern: {
								// 		value: /^[0-9]+$/,
								// 		message: 'Phone number must contain only numbers',
								// 	},
								// }
							)}
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
							InputLabelProps={{
								shrink: true,
							}}
							{...register('dob', { required: true })}
							fullWidth
						/>
					</Box>

					<Box className='form-row'>
						<TextField
							label='Address'
							variant='outlined'
							{...register(
								'address'
								// { required: true }
							)}
							fullWidth
							error={!!errors.address}
							helperText={errors.address ? errors.address.message : ''}
						/>
					</Box>

					<Box className='form-row'>
						<TextField
							label='Post Code'
							variant='outlined'
							{...register(
								'post_code'
								// { required: true }
							)}
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
							{...register(
								'gender'
								// { required: true }
							)}
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
