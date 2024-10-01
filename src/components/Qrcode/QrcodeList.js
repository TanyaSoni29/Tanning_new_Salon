/** @format */

import React, { useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import './QrcodeList.css';
import { useDispatch, useSelector } from 'react-redux';
import { refreshLocation } from '../../slices/locationSlice';

const QrcodeList = () => {
	const dispatch = useDispatch(); // Get the Redux dispatch function

	const { locations } = useSelector((state) => state.location);

	const [selectedLocation, setSelectedLocation] = useState(null);

	useEffect(() => {
		dispatch(refreshLocation());
	}, [dispatch]);

	const handleLocationClick = (index) => {
		setSelectedLocation(locations[index]);
	};

	const handlePrint = () => {
		const printContent = document.getElementById('print-area');
		const win = window.open('', '', 'height=500,width=800');
		win.document.write('<html><head><title>Print QR Code</title>');
		win.document.write('</head><body >');
		win.document.write(printContent.innerHTML);
		win.document.write('</body></html>');
		win.document.close();
		win.print();
	};

	return (
		<div className='qrcode-container'>
			<h2>Select Your Location</h2>
			<div className='location-circles'>
				{locations.map((location, index) => (
					<div
						key={index}
						className='location-circle'
						onClick={() => handleLocationClick(index)}
					>
						<div className='icon'>
							<i className='fa fa-laptop'></i>
						</div>
						<p>{location.name}</p>
					</div>
				))}
			</div>

			{selectedLocation && (
				<div
					className='qr-code-display'
					id='print-area'
				>
					<h3>{selectedLocation.name}</h3>
					{/* Dynamically generate a QR code with URL */}
					<QRCodeCanvas
						value={`https://backendcodersindia.com/${selectedLocation.name}`} // Encode a valid URL
						size={150} // QR code size
						className='qr-code-image'
					/>
				</div>
			)}

			<button
				className='next-button'
				onClick={handlePrint}
				disabled={!selectedLocation}
			>
				Print QR
			</button>
		</div>
	);
};

export default QrcodeList;
