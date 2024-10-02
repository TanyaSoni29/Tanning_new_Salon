/** @format */

import React, { useState } from 'react';
import './ProductreportList.css'; // Importing CSS
import { saveAs } from 'file-saver'; // For saving files
import jsPDF from 'jspdf'; // For generating PDFs
import { FaFileCsv, FaFilePdf } from 'react-icons/fa'; // Icons for CSV and PDF
import { useSelector } from 'react-redux';
import { formatDate } from '../../utils/formateDate';

const ProductList = ({ productTransaction }) => {
	const [dateRange, setDateRange] = useState({
		startDate: null,
		endDate: null,
	});
	const [selectedLocation, setSelectedLocation] = useState('All');
	const { locations } = useSelector((state) => state.location);

	const [searchTerm, setSearchTerm] = useState('');

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

	const filteredTransaction = productTransaction.filter((transaction) => {
		const transactionDate = new Date(transaction.transaction.created_at);
		const isInDateRange =
			dateRange.startDate && dateRange.endDate
				? transactionDate >= dateRange.startDate &&
				  transactionDate <= dateRange.endDate
				: true;
		const firstName = transaction?.user_details?.firstName?.toLowerCase() || '';
		const lastName = transaction?.user_details?.lastName?.toLowerCase() || '';
		const productName = transaction?.product?.name?.toLowerCase() || '';
		const matchesSearchQuery =
			`${firstName} ${lastName}`.includes(searchTerm.toLowerCase()) ||
			productName.includes(searchTerm.toLowerCase());
		const matchesLocation =
			selectedLocation === 'All' ||
			transaction.user_details?.preferred_location?.name === selectedLocation;

		return isInDateRange && matchesSearchQuery && matchesLocation;
	});

	// const handleDelete = (index) => {
	// 	const newProducts = [...products];
	// 	newProducts.splice(index, 1);
	// 	setProducts(newProducts);
	// };

	// Function to download CSV
	const handleDownloadCSV = () => {
		const headers = [
			'User Name',
			'PRODUCT Name',
			'Price',
			'Quantity',
			'Total',
			'Location',
			'Date/Time',
		];
		const csvRows = [
			headers.join(','), // header row
			...filteredTransaction.map((data) =>
				[
					`${data.user_details.firstName} ${data.user_details.lastName}`,
					data.product.name,
					data.product.price,
					data.transaction.quantity,
					data.user_details.preferred_location?.name,
					data.transaction.created_at,
				].join(',')
			),
		].join('\n');

		const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
		saveAs(blob, 'service-purchase.csv');
	};

	// Function to download PDF
	const handleDownloadPDF = () => {
		const doc = new jsPDF();

		doc.text('Service Used', 10, 10); // Title of the document
		let row = 20;

		// Table headers
		doc.text('Product Name', 10, row);
		doc.text('Price', 80, row);
		doc.text('Listed On', 140, row);
		row += 10;

		// Table content
		filteredTransaction.forEach((transaction) => {
			doc.text(
				`${transaction.user_details.firstName} ${transaction.user_details.lastName}`,
				10,
				row
			);
			doc.text(transaction.service?.name, 10, row);
			doc.text(
				`${transaction.user_details.firstName} ${transaction.user_details.lastName}`,
				10,
				row
			);
			doc.text(
				`${transaction.user_details.firstName} ${transaction.user_details.lastName}`,
				10,
				row
			);
			doc.text(transaction.product.price, 80, row);
			doc.text(transaction.transaction.created_at, 140, row);
			row += 10;
		});

		doc.save('products.pdf');
	};

	return (
		<div className='productreportlist-container'>
			<div className='productreportlist-search-container'>
				<input
					type='text'
					placeholder='Search transaction'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
				<div className='date-range-inputs'>
					<input
						type='date'
						name='startDate'
						placeholder='Start Date'
						onChange={handleDateRangeChange}
					/>
					<input
						type='date'
						name='endDate'
						placeholder='End Date'
						onChange={handleDateRangeChange}
					/>
				</div>
				<div className='location-select'>
					<select
						value={selectedLocation}
						onChange={handleLocationChange}
					>
						{uniqueLocations.map((location) => (
							<option
								key={location}
								value={location}
							>
								{location}
							</option>
						))}
					</select>
				</div>
				<div className='productreportlist-files'>
					<div
						className='productreportlist-download'
						onClick={handleDownloadCSV}
					>
						<FaFileCsv
							size={45}
							style={{ color: '#28a745' }}
						/>{' '}
						{/* Green for CSV */}
					</div>
					<div
						className='productreportlist-download'
						onClick={handleDownloadPDF}
					>
						<FaFilePdf
							size={45}
							style={{ color: '#dc3545' }}
						/>{' '}
						{/* Red for PDF */}
					</div>
				</div>
			</div>

			<div className='productreportlist-table'>
				<div className='productreportlist-table-header'>
					<span>USER NAME</span>
					<span>PRODUCT NAME</span>
					<span>PRICE</span>
					<span>QUANTITY</span>
					<span>TOTAL</span>
					<span>LOCATION</span>
					<span>DATE/TIME</span>
				</div>

				{filteredTransaction.length > 0 ? (
					filteredTransaction.map((transaction) => (
						<div
							key={transaction.transaction.id}
							className='serviceused-table-row'
						>
							<span>
								{transaction.user_details?.firstName}{' '}
								{transaction.user_details?.lastName}
							</span>
							<span>{transaction.product.name}</span>
							<span>{transaction.product.price}</span>
							<span>{transaction.transaction.quantity}</span>
							<span>
								{transaction.transaction.quantity} {transaction.product.price}
							</span>
							<span>{transaction.user_details.preferred_location?.name}</span>
							<span style={{ whiteSpace: 'nowrap' }}>
								{formatDate(transaction.transaction.created_at)}{' '}
								{transaction.transaction.created_at.split('T')[1].slice(0, 8)}
							</span>
						</div>
					))
				) : (
					<div className='productreportlist-no-data'>No transaction found.</div>
				)}
			</div>
		</div>
	);
};

export default ProductList;
