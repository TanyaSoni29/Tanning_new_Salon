/** @format */

import { Box, Button, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { updateUserProfile } from '../../service/operations/userProfileApi';
import { refreshUser } from '../../slices/userProfileSlice';
import { refreshLocation } from '../../slices/locationSlice';
import Modal from '../../components/Modal';
import ResetPassword from '../ResetPassword';

const EditUserModal = ({ activeUser, closeEditModal }) => {
	const { locations, loading } = useSelector((state) => state.location);
	const { token } = useSelector((state) => state.auth);
	const [resetPasswordModal, setResetPasswordModal] = useState(false);
	const filteredLocations = locations.filter((location) => location.isActive);

	const dispatch = useDispatch();
	const {
		register,
		handleSubmit,
		reset,
		setValue,
		formState: { errors, isSubmitSuccessful },
	} = useForm();

	useEffect(() => {
		if (!activeUser) {
			closeEditModal();
		}
	}, []);

	useEffect(() => {
		dispatch(refreshLocation());
	}, [dispatch]);

	useEffect(() => {
		if (activeUser?.profile?.preferred_location) {
			setValue('preferred_location', activeUser.profile.preferred_location);
		}
	}, [activeUser, setValue]);

	const handleResetPassword = async () => {
		setResetPasswordModal(true);
	};

	const closeResetPassword = () => {
		setResetPasswordModal(false);
	};

	const handleSubmitForm = async (data) => {
		try {
			const newUserData = {
				user_id: activeUser.user.id,
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
			};
			const updatedUser = await updateUserProfile(
				token,
				activeUser.user.id,
				newUserData
			);
			if (updatedUser) {
				dispatch({ type: 'userProfile/updateUser', payload: updatedUser });
			}
			dispatch(refreshUser());
			closeEditModal();
		} catch (error) {
			console.error(error);
			closeEditModal();
		}
	};

	useEffect(() => {
		if (isSubmitSuccessful) {
			reset({
				firstName: '',
				lastName: '',
				role: '',
				email: '',
				address: '',
				postCode: '',
				phone_number: '',
				gender: '',
				referred_by: '',
				preferred_location: '',
				avatar: '',
			});
		}
	}, [reset, isSubmitSuccessful]);

	if (!activeUser) return null;

	return (
		<Box
			sx={{
				width: '100%',
				maxWidth: { xs: '100%', sm: '500px', md: '700px', lg: '800px' },
				padding: '16px',
				margin: 'auto',
				marginTop: '10%',
				backgroundColor: 'var(--modal--formbg)',
				borderRadius: '8px',
				boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
				boxSizing: 'border-box',
				maxHeight: '90vh', // Ensures modal doesn't exceed screen height
				overflowY: 'auto', // Adds scroll for overflowing content
			}}
		>
			<Typography variant='h6' color='var(--modal--formbgtextcol)'>Edit User</Typography>
			<form onSubmit={handleSubmit(handleSubmitForm)}>
				<Box mt={2}>
					<Box
						sx={{
							display: 'flex',
							flexDirection: { xs: 'column', md: 'row' },
							gap: '16px',
							marginBottom: '16px',
						}}
					>
						<TextField
							label='First Name'
							variant='outlined'
							defaultValue={activeUser.profile?.firstName}
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
							InputLabelProps={{
								style: { color: 'var(--modal--formbgtextcol)' }, // Label color
							}}
							InputProps={{
								style: { color: 'var(--modal--formbgtextcol)' }, // Input text color
							}}
						/>
						<TextField
							label='Last Name'
							variant='outlined'
							defaultValue={activeUser.profile?.lastName}
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
							InputLabelProps={{
								style: { color: 'var(--modal--formbgtextcol)' }, // Label color
							}}
							InputProps={{
								style: { color: 'var(--modal--formbgtextcol)' }, // Input text color
							}}
						/>
					</Box>

					<Box
						sx={{
							display: 'flex',
							flexDirection: { xs: 'column', md: 'row' },
							gap: '16px',
							marginBottom: '16px',
						}}
					>
						<TextField
							label='Email'
							variant='outlined'
							defaultValue={activeUser.user?.email}
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
							InputLabelProps={{
								style: { color: 'var(--modal--formbgtextcol)' }, // Label color
							}}
							InputProps={{
								style: { color: 'var(--modal--formbgtextcol)' }, // Input text color
							}}
						/>
						<TextField
							label='Phone Number'
							variant='outlined'
							defaultValue={activeUser.profile?.phone_number}
							{...register('phone_number', {
								required: 'Phone number is required',
								maxLength: {
									value: 15,
									message: 'Phone number must not exceed 15 digits',
								},
								pattern: {
									value: /^[0-9]+$/, // Accepts only numeric values
									message: 'Phone number must contain only numbers',
								},
							})}
							fullWidth
							error={!!errors.phone_number}
							helperText={
								errors.phone_number ? errors.phone_number.message : ''
							}
							InputLabelProps={{
								style: { color: 'var(--modal--formbgtextcol)' }, // Label color
							}}
							InputProps={{
								style: { color: 'var(--modal--formbgtextcol)' }, // Input text color
							}}
						/>
					</Box>

					<Box mb={2}>
						<TextField
							label='Address'
							variant='outlined'
							defaultValue={activeUser.profile?.address}
							{...register('address', { required: true })}
							fullWidth
							error={!!errors.address}
							helperText={errors.address ? errors.address.message : ''}
							InputLabelProps={{
								style: { color: 'var(--modal--formbgtextcol)' }, // Label color
							}}
							InputProps={{
								style: { color: 'var(--modal--formbgtextcol)' }, // Input text color
							}}
						/>
					</Box>

					<Box
						sx={{
							display: 'flex',
							flexDirection: { xs: 'column', md: 'row' },
							gap: '16px',
							marginBottom: '16px',
						}}
					>
						<TextField
							label='Post Code'
							variant='outlined'
							defaultValue={activeUser.profile?.post_code}
							{...register('post_code', { required: true })}
							fullWidth
							error={!!errors.post_code}
							helperText={errors.post_code ? errors.post_code.message : ''}
							InputLabelProps={{
								style: { color: 'var(--modal--formbgtextcol)' }, // Label color
							}}
							InputProps={{
								style: { color: 'var(--modal--formbgtextcol)' }, // Input text color
							}}
						/>
						<TextField
							label='Referred By'
							variant='outlined'
							defaultValue={activeUser.profile?.referred_by}
							{...register('referred_by')}
							fullWidth
							InputLabelProps={{
								style: { color: 'var(--modal--formbgtextcol)' }, // Label color
							}}
							InputProps={{
								style: { color: 'var(--modal--formbgtextcol)' }, // Input text color
							}}
						/>
					</Box>

					<Box
						sx={{
							display: 'flex',
							flexDirection: { xs: 'column', md: 'row' },
							gap: '16px',
							marginBottom: '16px',
						}}
					>
						<select
							className='custom-select'
							defaultValue={activeUser.user?.role}
							{...register('role', { required: true })}
							style={{
								height: '50px',
								padding: '8px',
								fontSize: '14px',
								border: '1px solid #ccc',
								borderRadius: '4px',
								width: '100%',
								backgroundColor: 'var(--modal--formbg)',
								color: 'var(--modal--formbgtextcol)',
							}}
						>
							<option value=''>Select Role</option>
							<option value='admin'>Admin</option>
							<option value='operator'>User</option>
						</select>

						<select
							className='custom-select'
							defaultValue={activeUser.profile?.gender}
							{...register('gender')}
							style={{
								height: '50px',
								padding: '8px',
								fontSize: '14px',
								border: '1px solid #ccc',
								borderRadius: '4px',
								width: '100%',
								backgroundColor: 'var(--modal--formbg)',
								color: 'var(--modal--formbgtextcol)',
							}}
						>
							<option value=''>Select Gender</option>
							<option value='Male'>Male</option>
							<option value='Female'>Female</option>
							<option value='Other'>Other</option>
						</select>
					</Box>

					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							marginBottom: '16px',
						}}
					>
						<select
							className='custom-select'
							defaultValue={activeUser.profile?.preferred_location}
							{...register('preferred_location', { required: true })}
							disabled={loading}
							style={{
								height: '50px',
								padding: '8px',
								fontSize: '14px',
								border: '1px solid #ccc',
								borderRadius: '4px',
								width: '100%',
								backgroundColor: 'var(--modal--formbg)',
								color: 'var(--modal--formbgtextcol)',
							}}
						>
							<option value=''>Select Location</option>
							{filteredLocations.map((location) => (
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
					sx={{
						display: 'flex',
						justifyContent: { xs: 'space-between', md: 'flex-end' },
						gap: '1rem',
						marginTop: '16px',
					}}
				>
					<Button
						variant='contained'
						sx={{
							'backgroundColor': '#0c65be',
							'color': 'white',
							'borderRadius': '5px',
							'padding': { xs: '5px 10px', lg: '8px 15px' },
							'fontSize': { xs: '10px', lg: '13px' },
							':hover': { backgroundColor: '#000' },
						}}
						onClick={handleResetPassword}
					>
						Reset Password
					</Button>
					<Button
						variant='contained'
						sx={{
							'backgroundColor': '#0c65be',
							'color': 'white',
							'borderRadius': '5px',
							'padding': { xs: '5px 10px', lg: '8px 15px' },
							'fontSize': { xs: '10px', lg: '13px' },
							':hover': { backgroundColor: '#000' },
						}}
						type='submit'
					>
						Submit
					</Button>
					<Button
						variant='contained'
						color='info'
						onClick={closeEditModal}
						sx={{
							'backgroundColor': '#fff',
							'color': '#666',
							'border': '1px solid #ccc',
							'borderRadius': '5px',
							'padding': { xs: '5px 10px', lg: '8px 15px' },
							'fontSize': { xs: '10px', lg: '13px' },
							':hover': { backgroundColor: '#f1f1f1' },
						}}
					>
						Cancel
					</Button>
				</Box>
			</form>

			{activeUser && resetPasswordModal && (
				<Modal
					open={resetPasswordModal}
					setOpen={setResetPasswordModal}
				>
					<ResetPassword
						onClose={closeResetPassword}
						activeUser={activeUser}
					/>
				</Modal>
			)}
		</Box>
	);
};

export default EditUserModal;
