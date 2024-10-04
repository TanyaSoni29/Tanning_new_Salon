/** @format */

import { Box, Button, TextField, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { refreshUser } from '../slices/userProfileSlice';
import { resetPassword } from '../service/operations/userApi';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

function ResetPassword({ onClose, activeUser }) {
	const { token } = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitSuccessful },
	} = useForm();

	useEffect(() => {
		if (isSubmitSuccessful) {
			reset({
				email: '',
				password: '',
			});
		}
	}, [reset, isSubmitSuccessful]);

	const handleSubmitForm = async (data) => {
		try {
			const newData = {
				email: data.email,
				password: data.password,
			};
			const response = await resetPassword(token, newData);
			dispatch(refreshUser());
			onClose();
		} catch (error) {
			console.error(error);
		} finally {
			onClose();
			reset();
		}
	};

	return (
		<>
			<Box className='modal-container'>
				<Typography
					id='edit-location-modal-title'
					variant='h6'
				>
					Reset Password
				</Typography>
				<form onSubmit={handleSubmit(handleSubmitForm)}>
					<Box mt={2}>
						<Box className='form-row'>
							<TextField
								label='Email'
								variant='outlined'
								defaultValue={activeUser.user?.email}
								{...register('email', { required: true })}
								fullWidth
							/>

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
							onClick={() => onClose()}
						>
							Cancel
						</Button>
					</Box>
				</form>
			</Box>
		</>
	);
}

export default ResetPassword;
