/**
 * eslint-disable react/function-component-definition
 *
 * @format
 */

import * as React from 'react';
import { Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';

export default function BasicCard({ onClose }) {
	const navigate = useNavigate();
	const { customer } = useSelector((state) => state.customer);
	const handleNo = () => {
		if (customer) {
			navigate('/service');
		} else {
			navigate('/about');
		}
	};

	return (
		<Box
			sx={{
				width: { xs: '90vw', sm: '60vw', md: '40vw', lg: '20vw' }, // Responsive widths for different screen sizes
				padding: 2,
				margin: 'auto',
				backgroundColor: '#fff',
				borderRadius: 2,
				boxShadow: 3, // Adds a subtle shadow to the box for a better look
			}}
		>
			<Typography
				id='add-location-modal-title'
				variant='h6'
				sx={{ textAlign: 'center' }} // Centering the text for better aesthetics
			>
				Have you used a tanning salon in the last 24 hours?
			</Typography>
			<Box
				mt={2}
				display='flex'
				justifyContent='center'
				flexWrap='wrap'
				gap={2}
				sx={{
					flexDirection: { xs: 'column', sm: 'row' }, // Stack buttons on mobile, row on larger screens
				}}
			>
				<Button
					variant='contained'
					onClick={handleNo}
					sx={{
						'width': { xs: '100%', sm: 'auto' }, // Full-width on mobile
						'backgroundColor': 'green', // Red background for "No" button
						'color': '#fff', // White text color for better contrast
						'&:hover': {
							opacity: '80%', // Darker shade on hover
						},
					}}
				>
					No
				</Button>
				<Button
					variant='outlined'
					onClick={onClose}
					sx={{
						'width': { xs: '100%', sm: 'auto' }, // Full-width on mobile
						'borderColor': 'red', // Green border for "Yes" button
						'color': 'red', // Green text color
						'&:hover': {
							backgroundColor: '#F42819', // Light green background on hover
							borderColor: 'red',
							color: '#fff',
						},
					}}
				>
					Yes
				</Button>
			</Box>
		</Box>
	);
}
