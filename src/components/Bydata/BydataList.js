/** @format */

import React, { useState } from 'react';
import './BydataList.css'; // Importing CSS
import { saveAs } from 'file-saver'; // For saving files
import jsPDF from 'jspdf'; // For generating PDFs
import { FaFileCsv, FaFilePdf } from 'react-icons/fa'; // Icons for CSV and PDF
import { useSelector } from 'react-redux';

const BydataList = () => {
	const { customers } = useSelector((state) => state.customer);
	const { locations } = useSelector((state) => state.location);
	const [searchTerm, setSearchTerm] = useState('');
	const [dateRange, setDateRange] = useState({
		startDate: null,
		endDate: null,
	});
	const [selectedLocation, setSelectedLocation] = useState('All');

	const uniqueLocations = [
		'All',
		...new Set(locations.map((location) => location.name)),
	];

	const handleDateRangeChange = (e) => {
		const { name, value } = e.target;
		setDateRange((prevRange) => ({
			...prevRange,
			[name]: value ? new Date(value) : null,
		}));
	};

	const handleLocationChange = (e) => {
		setSelectedLocation(e.target.value);
	};

	// const filteredCustomers = customers.filter(
	// 	(data) => {
	// 		const CustomerDate = new Date(data.user)
	// 	}
	// 		(data.user.firstName &&
	// 			data.user.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
	// 		(data.profile?.phone_number &&
	// 			data.profile?.phone_number
	// 				.toLowerCase()
	// 				.includes(searchTerm.toLowerCase()))
	// );

	// const handleDelete = (index) => {
	// 	const newBydata = [...bydata];
	// 	newBydata.splice(index, 1);
	// 	setBydata(newBydata);
	// };

	// Function to download CSV
	// const handleDownloadCSV = () => {
	// 	const headers = ['Data Name', 'Price', 'Listed On'];
	// 	const csvRows = [
	// 		headers.join(','), // header row
	// 		...bydata.map((data) =>
	// 			[data.dataName, data.price, data.listedOn].join(',')
	// 		),
	// 	].join('\n');

	// 	const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
	// 	saveAs(blob, 'bydata.csv');
	// };

	// Function to download PDF
	// const handleDownloadPDF = () => {
	// 	const doc = new jsPDF();

	// 	doc.text('Bydata List', 10, 10); // Title of the document
	// 	let row = 20;

	// 	// Table headers
	// 	doc.text('Data Name', 10, row);
	// 	doc.text('Price', 80, row);
	// 	doc.text('Listed On', 140, row);
	// 	row += 10;

	// 	// Table content
	// 	bydata.forEach((data) => {
	// 		doc.text(data.dataName, 10, row);
	// 		doc.text(data.price, 80, row);
	// 		doc.text(data.listedOn, 140, row);
	// 		row += 10;
	// 	});

	// 	doc.save('bydata.pdf');
	// };

	return (
		<div className='bydata-container'>
			<div className='bydata-search-container'>
				<input
					type='text'
					placeholder='Search'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
				<div className='bydata-files'>
					<div
						className='bydata-download'
						// onClick={handleDownloadCSV}
					>
						<FaFileCsv
							size={45}
							style={{ color: '#28a745' }}
						/>{' '}
						{/* Green for CSV */}
					</div>
					<div
						className='bydata-download'
						// onClick={handleDownloadPDF}
					>
						<FaFilePdf
							size={45}
							style={{ color: '#dc3545' }}
						/>{' '}
						{/* Red for PDF */}
					</div>
				</div>
			</div>

			<div className='bydata-table'>
				<div className='bydata-table-header'>
					<span>DATA NAME</span>
					<span>PRICE</span>
					<span>LISTED ON</span>
				</div>

				{customers.length > 0 ? (
					customers.map((data, index) => (
						<div
							key={index}
							className='bydata-table-row'
						>
							<span>{data.profile?.firstName}</span>
							<span>{data.profile.preferred_location}</span>
							<span>{data.user.created_at}</span>
						</div>
					))
				) : (
					<div className='no-data'>No data found.</div>
				)}
			</div>
		</div>
	);
};

export default BydataList;
