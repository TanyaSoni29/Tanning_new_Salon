/** @format */

import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { updateLocation } from '../../service/operations/locationApi';
import { refreshLocation } from '../../slices/locationSlice';
import ContentCopyIcon from '@mui/icons-material/ContentCopy'; // Import copy icon
import CheckIcon from '@mui/icons-material/Check'; // Import check icon
const EditLocationModal = ({ activeLocation, closeEditModal }) => {
	const { token } = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const [showLink, setShowLink] = useState(false);
	const [copied, setCopied] = useState(false);
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitSuccessful },
	} = useForm({
		defaultValues: {
			name: activeLocation.name,
			address: activeLocation.address,
			phone_number: activeLocation.phone_number,
			post_code: activeLocation.post_code,
		},
	});

	const handleSubmitForm = async (data) => {
		try {
			const updatedData = {
				name: data.name,
				address: data.address,
				phone_number: data.phone_number,
				post_code: data.post_code,
			};
			const result = await updateLocation(
				token,
				activeLocation.id,
				updatedData
			);

			if (result) {
				dispatch(refreshLocation());
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
				address: '',
				post_code: '',
				phone_number: '',
			});
		}
	}, [reset, isSubmitSuccessful]);

	const handleCopyToClipboard = () => {
		const link = `https://salon-customer.vercel.app/register/${activeLocation.id}`;
		navigator.clipboard.writeText(link).then(() => {
			setCopied(true); // Show the check icon when copied
			setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
		});
	};

	return (
		<Box
			sx={{
				width: '100%',
				maxWidth: { xs: '100%', sm: '500px', md: '700px' },
				padding: '16px',
				margin: 'auto',
				marginTop: { xs: '20px', md: '10%' },
				backgroundColor: '#fff',
				borderRadius: '8px',
				boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
				boxSizing: 'border-box',
			}}
		>
			<Typography
				variant='h6'
				id='edit-location-modal-title'
			>
				Edit Location
			</Typography>

			<form onSubmit={handleSubmit(handleSubmitForm)}>
				<Box
					mt={2}
					sx={{
						display: 'flex',
						flexDirection: { xs: 'column', md: 'row' },
						justifyContent: 'center',
						alignItems: 'center',
						gap: 2,
					}}
				>
					<TextField
						label='Name'
						fullWidth
						{...register('name', { required: true })}
						error={!!errors.name}
						helperText={errors.name ? 'Name is required' : ''}
					/>
					<TextField
						label='Phone Number'
						{...register('phone_number', {
							required: 'Phone number is required',
							pattern: {
								value: /^[0-9]{10,15}$/,
								message: 'Phone number must be between 10 to 15 digits',
							},
						})}
						fullWidth
						error={!!errors.phone_number}
						helperText={errors.phone_number ? errors.phone_number.message : ''}
					/>
				</Box>

				<Box mt={2}>
					<TextField
						label='Address'
						fullWidth
						{...register('address', { required: true })}
						error={!!errors.address}
						helperText={errors.address ? 'Address is required' : ''}
					/>
				</Box>

				<Box mt={2}>
					<TextField
						label='Post Code'
						fullWidth
						{...register('post_code', { required: true })}
						error={!!errors.post_code}
						helperText={errors.post_code ? 'Post Code is required' : ''}
					/>
				</Box>

				{showLink && (
					<Box
						mt={2}
						display='flex'
						alignItems='center'
						gap={1}
					>
						<Typography color='primary'>
							https://salon-customer.vercel.app/register/{activeLocation.id}
						</Typography>
						<Button
							onClick={handleCopyToClipboard}
							variant='outlined'
							sx={{
								borderRadius: '20px',
							}}
						>
							{copied ? <CheckIcon color='success' /> : <ContentCopyIcon />}
						</Button>
						{copied && (
							<Typography
								variant='body2'
								color='success'
							>
								Copied!
							</Typography>
						)}
					</Box>
				)}

				<Box
					mt={2}
					display='flex'
					justifyContent='end'
					gap={2}
					sx={{
						flexDirection: { xs: 'column', sm: 'row' },
						alignItems: { xs: 'stretch', sm: 'center' },
					}}
				>
					<Button
						variant='contained'
						onClick={() => setShowLink(true)}
						sx={{
							'width': { xs: '100%', sm: 'auto' },
							'backgroundColor': '#0c65be',
							'color': 'white',
							':hover': { backgroundColor: '#004080' },
						}}
					>
						QR Link
					</Button>
					<Button
						variant='contained'
						type='submit'
						sx={{
							'width': { xs: '100%', sm: 'auto' },
							'backgroundColor': '#0c65be',
							'color': 'white',
							':hover': { backgroundColor: '#004080' },
						}}
					>
						Submit
					</Button>
					<Button
						variant='outlined'
						onClick={closeEditModal}
						sx={{
							'width': { xs: '100%', sm: 'auto' },
							'backgroundColor': '#fff',
							'color': '#666',
							'border': '1px solid #ccc',
							':hover': { backgroundColor: '#f1f1f1' },
						}}
					>
						Cancel
					</Button>
				</Box>
			</form>
		</Box>
	);
};

export default EditLocationModal;
