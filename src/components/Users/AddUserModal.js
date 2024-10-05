/** @format */

// CreateUserModal.js
import { Box, Button, TextField, Typography, Avatar } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { addUser, refreshUser } from '../../slices/userProfileSlice';
import { refreshLocation } from '../../slices/locationSlice'; // Import refreshLocation
import { createUser } from '../../service/operations/userApi';

const AddUserModal = ({ closeAddModal }) => {
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
				role: data.role,
				email: data.email,
				address: data.address,
				post_code: data.post_code,
				phone_number: data.phone_number,
				gender: data.gender || '',
				gdpr_sms_active: data.gdpr_sms_active || false,
				gdpr_email_active: data.gdpr_email_active || false,
				referred_by: data.referred_by || '',
				preferred_location: data.preferred_location,
				avatar: '',
			};
			const newUser = await createUser(token, newUserData);
			if (newUser) {
				dispatch(addUser(newUser));
			}
			dispatch(refreshUser());
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
				role: '',
				email: '',
				address: '',
				post_code: '',
				phone_number: '',
				gender: '',
				referred_by: '',
				preferred_location: '',
				avatar: '',
			});
		}
	}, [reset, isSubmitSuccessful]);

	return (
		<Box className='modal-container'>
			<Typography
				id='add-location-modal-title'
				variant='h6'
			>
				Add New User
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
							{...register('email', {
								required: 'Email is required',
								pattern: {
									value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
									message: 'Please enter a valid email address',
								},
							})}
							fullWidth
							error={!!errors.email}
							helperText={errors.email ? errors.email.message : ''}
						/>
						<TextField
							label='Phone Number'
							variant='outlined'
							{...register('phone_number', {
								required: 'Phone number is required',
								pattern: {
									value: /^[0-9]{10,15}$/, // Example: accept numbers of length 10 to 15
									message: 'Phone number must be between 10 to 15 digits',
								},
							})}
							fullWidth
							error={!!errors.phone_number}
							helperText={
								errors.phone_number ? errors.phone_number.message : ''
							}
						/>
					</Box>

					<Box className='form-row'>
						<TextField
							label='Password'
							variant='outlined'
							{...register('password', {
								required: 'Password is required',
								minLength: {
									value: 6,
									message: 'Password must be at least 6 characters',
								},
							})}
							fullWidth
							error={!!errors.password}
							helperText={errors.password ? errors.password.message : ''}
						/>
						<TextField
							label='Referred By'
							variant='outlined'
							{...register('referred_by')}
							fullWidth
						/>
					</Box>

					<TextField
						label='Address'
						variant='outlined'
						{...register('address', { required: true })}
						fullWidth
						error={!!errors.address}
						helperText={errors.address ? errors.address.message : ''}
					/>

					<Box
						mt={2}
						className='form-row'
					>
						<TextField
							label='Post Code'
							variant='outlined'
							{...register('post_code', { required: true })}
							fullWidth
							error={!!errors.post_code}
							helperText={errors.post_code ? errors.post_code.message : ''}
						/>
						<select
							className='custom-select'
							{...register('gender')}
						>
							<option value=''>Select Gender</option>
							<option value='Male'>Male</option>
							<option value='Female'>Female</option>
							<option value='Other'>Other</option>
						</select>
					</Box>

					<Box className='form-row'>
						<select
							className='custom-select'
							{...register('role', { required: true })}
						>
							<option value=''>Select Role</option>
							<option value='admin'>Admin</option>
							<option value='operator'>User</option>
						</select>
						<select
							className='custom-select'
							{...register('preferred_location', { required: true })}
							disabled={loading}
						>
							<option value=''>Select Location</option>
							{locations.map((location) => (
								<option
									key={location.id}
									value={location.id}
								>
									{location.name}
								</option>
							))}
						</select>
					</Box>
				</Box>

				<Box
					mt={2}
					display='flex'
					justifyContent='flex-end'
					gap='1rem'
				>
					<Button
						variant='contained'
						className='confirm-button'
						type='submit'
					>
						Submit
					</Button>
					<Button
						variant='contained'
						color='info'
						onClick={closeAddModal}
						className='cancel-button'
					>
						Cancel
					</Button>
				</Box>
			</form>
		</Box>
	);
};

export default AddUserModal;
