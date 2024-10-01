/**
 * eslint-disable react/prop-types
 *
 * @format
 */

/* eslint-disable react/function-component-definition */
import * as React from 'react';
import { Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router';

export default function BasicCard({ onClose }) {
	const navigate = useNavigate();
	const handleNo = () => {
		navigate('/service');
	};
	return (
		<Box
			sx={{
				width: '20vw',
				padding: 2,
				margin: 'auto',
				backgroundColor: '#fff',
				borderRadius: 2,
			}}
		>
			<Typography
				id='add-location-modal-title'
				variant='h6'
			>
				Have you used a tanning salon in the last 24 hours?
			</Typography>
			<Box
				mt={2}
				display='flex'
				justifyContent='end'
				gap={2}
			>
				<button
					onClick={handleNo}
					className='confirm-button'
				>
					No
				</button>
				<button
					className='cancel-button'
					onClick={onClose}
				>
					Yes
				</button>
			</Box>
		</Box>
	);
}
