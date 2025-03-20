/** @format */

import React, { useEffect, useState } from 'react';
import {
	Box,
	Button,
	FormControlLabel,
	Switch,
	TextField,
	Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { updateUserProfile } from '../../service/operations/userProfileApi';
import { refreshLocation } from '../../slices/locationSlice';
import { refreshSearchCustomers } from '../../slices/customerProfile';
import Modal from '../../components/Modal';
import ResetPassword from '../ResetPassword';
import './AddCustomer.css';

const EditCustomerModal = ({
	closeEditModal,
	activeUser,
	searchTerm,
	selectedLocation,
}) => {
	const { locations, loading } = useSelector((state) => state.location);
	const [preferredLocation, setPreferredLocation] = useState('');
	const [resetPasswordModal, setResetPasswordModal] = useState(false);
	const { token } = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const filteredLocations = locations.filter((location) => location.isActive);
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
	}, [activeUser, closeEditModal]);

	const handleResetPassword = async () => {
		setResetPasswordModal(true);
	};

	const closeResetPassword = () => {
		setResetPasswordModal(false);
	};

	useEffect(() => {
		dispatch(refreshLocation());
	}, [dispatch]);

	useEffect(() => {
		if (activeUser?.profile?.preferred_location) {
			setValue('preferred_location', activeUser.profile.preferred_location);
		}
	}, [activeUser, setValue]);

	const handleSubmitForm = async (data) => {
		try {
			const newUserData = {
				user_id: activeUser.user.id,
				firstName: data.firstName,
				lastName: data.lastName,
				email: data.email,
				address: data.address || '',
				post_code: data.post_code || '',
				phone_number: data.phone_number,
				gender: data.gender || '',
				dob: data.dob || '', // Added Date of Birth field
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
				dispatch({
					type: 'customer/updateCustomer',
					payload: updatedUser,
				});
				closeEditModal();
				reset();
			}
			if (selectedLocation === 0) {
				dispatch(refreshSearchCustomers(searchTerm));
			} else {
				dispatch(refreshSearchCustomers(searchTerm, selectedLocation));
			}
		} catch (error) {
			console.error(error);
		}
	};

	// useEffect(() => {
	// 	if (isSubmitSuccessful) {
	// 		reset({
	// 			firstName: '',
	// 			lastName: '',
	// 			email: '',
	// 			address: '',
	// 			post_code: '',
	// 			phone_number: '',
	// 			gender: '',
	// 			referred_by: '',
	// 			preferred_location: '',
	// 			dob: '', // Reset Date of Birth field
	// 			gdpr_sms_active: false,
	// 			gdpr_email_active: false,
	// 		});
	// 	}
	// }, [reset, isSubmitSuccessful]);

	if (!activeUser) return null;

	return (
		<Box className='addCustomer-modal-container'>
			<Typography
				variant='h6'
				color='var(--modal--formbgtextcol)'
			>
				Edit Customer
			</Typography>
			<form onSubmit={handleSubmit(handleSubmitForm)}>
				<Box mt={2}>
					<Box className='form-row'>
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

					<Box className='form-row'>
						<TextField
							label='Email'
							variant='outlined'
							defaultValue={activeUser.user?.email}
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
							InputLabelProps={{
								style: { color: 'var(--modal--formbgtextcol)' }, // Label color
							}}
							InputProps={{
								style: { color: 'var(--modal--formbgtextcol)' }, // Input text color
							}}
						/>
					</Box>

					<Box className='form-row'>
						<TextField
							label='Date of Birth'
							variant='outlined'
							type='date'
							InputLabelProps={{
								style: { color: 'var(--modal--formbgtextcol)' }, // Label color
								shrink: true, // Keeps the label shrunk when the input is empty
							}}
							InputProps={{
								style: { color: 'var(--modal--formbgtextcol)' }, // Input text color
							}}
							defaultValue={activeUser.profile?.dob} // Set default Date of Birth
							{...register('dob', { required: true })}
							fullWidth
							error={!!errors.dob}
							helperText={errors.dob ? errors.dob.message : ''}
						/>
					</Box>

					<Box mb={2}>
						<TextField
							label='Address'
							variant='outlined'
							defaultValue={activeUser.profile?.address}
							{...register(
								'address'
								// { required: true }
							)}
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

					<Box className='form-row'>
						<TextField
							label='Post Code'
							variant='outlined'
							defaultValue={activeUser.profile?.post_code}
							{...register(
								'post_code'
								// { required: true }
							)}
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

					<Box className='form-row'>
						<select
							id='location'
							className='custom-select'
							defaultValue={activeUser.profile?.preferred_location}
							{...register('preferred_location', { required: true })}
							disabled={loading}
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

						<select
							id='gender'
							className='custom-select'
							defaultValue={activeUser.profile?.gender}
							{...register(
								'gender'
								// { required: true }
							)}
						>
							<option value=''>Select Gender</option>
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
									defaultChecked={activeUser.profile?.gdpr_sms_active}
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
									defaultChecked={activeUser.profile?.gdpr_email_active}
								/>
							}
							label='Email'
							className='form-control-label'
						/>
					</Box>
				</Box>

				<Box className='button-row'>
					{/* <Button variant='contained' className='confirm-button' onClick={handleResetPassword}>
						Reset Password
					</Button> */}
					<Button
						variant='contained'
						className='cancel-button'
						onClick={closeEditModal}
					>
						Cancel
					</Button>
					<Button
						variant='contained'
						className='confirm-button'
						type='submit'
					>
						Submit
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

export default EditCustomerModal;
