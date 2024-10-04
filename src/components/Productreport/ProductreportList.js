/** @format */

import React, { useState, useMemo, useCallback } from 'react';
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
	const [searchTerm, setSearchTerm] = useState('');

	const { locations } = useSelector((state) => state.location);

	const uniqueLocations = useMemo(
		() => ['All', ...new Set(locations.map((location) => location.name))],
		[locations]
	);

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

	const handleSearchChange = useCallback(
		(e) => {
			setSearchTerm(e.target.value);
		},
		[setSearchTerm]
	);

	const filteredTransaction = useMemo(() => {
		return productTransaction.filter((transaction) => {
			const transactionDate = new Date(transaction.transaction.created_at);
			const isInDateRange =
				dateRange.startDate && dateRange.endDate
					? transactionDate >= dateRange.startDate &&
					  transactionDate <= dateRange.endDate
					: true;

			const firstName =
				transaction?.user_details?.firstName?.toLowerCase() || '';
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
	}, [productTransaction, dateRange, searchTerm, selectedLocation]);

	const handleDownloadCSV = () => {
		const headers = [
			'User Name',
			'Product Name',
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
					data.transaction.quantity * data.product.price,
					data.user_details.preferred_location?.name,
					formatDate(data.transaction.created_at),
				].join(',')
			),
		].join('\n');

		const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
		saveAs(blob, 'product-purchase.csv');
	};

	const handleDownloadPDF = () => {
		const doc = new jsPDF('p', 'pt', 'a4'); // Use A4 page size in points
		const pageWidth = doc.internal.pageSize.getWidth(); // Get page width
		const pageHeight = doc.internal.pageSize.getHeight(); // Get page height
		const margin = 10; // Set margin for the document
		const lineHeight = 20; // Set line height for table rows
		const headerHeight = 30; // Height for the header
		let row = margin + headerHeight; // Starting y-position for content

		// Define the column positions to fit within the page width
		const columns = {
			userName: margin, // First column starts from left margin
			productName: margin + 80, // Next column 80pt from the first one
			price: margin + 220, // Adjust based on previous column widths
			quantity: margin + 280,
			total: margin + 340,
			location: margin + 450,
			dateTime: margin + 520, // Adjust this so it fits within the page
		};

		doc.setFontSize(12);
		doc.setFont('helvetica', 'bold');
		doc.text('Product Purchase Report', margin, margin); // Title at the top

		// Add table headers
		doc.setFontSize(10);
		doc.text('User Name', columns.userName, row);
		doc.text('Product', columns.productName, row);
		doc.text('Price', columns.price, row);
		doc.text('Quantity', columns.quantity, row);
		doc.text('Total', columns.total, row);
		doc.text('Location', columns.location, row);
		doc.text('Date/Time', columns.dateTime, row);

		// Move to the next row for table data
		row += lineHeight;

		// Reset font for table data
		doc.setFont('helvetica', 'normal');

		// Loop through filtered transactions and add each row
		filteredTransaction.forEach((transaction) => {
			// Check if adding new row exceeds the page height, and if so, add a new page
			if (row + lineHeight > pageHeight - margin) {
				doc.addPage(); // Add new page
				row = margin + headerHeight; // Reset row for new page

				// Re-add the table headers on the new page
				doc.setFont('helvetica', 'bold');
				doc.text('User Name', columns.userName, row);
				doc.text('Product', columns.productName, row);
				doc.text('Price', columns.price, row);
				doc.text('Quantity', columns.quantity, row);
				doc.text('Total', columns.total, row);
				doc.text('Location', columns.location, row);
				doc.text('Date/Time', columns.dateTime, row);
				row += lineHeight;
				doc.setFont('helvetica', 'normal');
			}

			// Add transaction data in the respective columns
			doc.text(
				`${transaction.user_details.firstName} ${transaction.user_details.lastName}`,
				columns.userName,
				row
			);
			doc.text(transaction.product?.name, columns.productName, row);
			doc.text(`${transaction.product.price}`, columns.price, row);
			doc.text(`${transaction.transaction.quantity}`, columns.quantity, row);
			doc.text(
				`${transaction.transaction.quantity * transaction.product.price}`,
				columns.total,
				row
			);
			doc.text(
				transaction.user_details.preferred_location?.name || 'N/A',
				columns.location,
				row
			);
			doc.text(
				formatDate(transaction.transaction.created_at),
				columns.dateTime,
				row
			);

			// Move to the next row
			row += lineHeight;
		});

		doc.save('product-purchase.pdf'); // Save the generated PDF
	};

	return (
		<div className='productreportlist-container'>
			<div className='Filter-product'>
			<div className='productreportlist-search-container'>
				<input
					type='text'
					placeholder='Search'
					value={searchTerm}
					onChange={handleSearchChange}
				/>
			</div>
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
						/>
					</div>
					<div
						className='productreportlist-download'
						onClick={handleDownloadPDF}
					>
						<FaFilePdf
							size={45}
							style={{ color: '#dc3545' }}
						/>
					</div>
				</div>
			
			</div>

			<div className='productreportlist-table'>
				<div className='productreportlist-table-header'>
					<span>User Name</span>
					<span>Product Name</span>
					<span>Price</span>
					<span>Qunatity</span>
					<span>Total</span>
					<span>Location</span>
					<span>Date/Time</span>
				</div>

				{filteredTransaction.length > 0 ? (
					filteredTransaction.map((transaction) => (
						<div
							key={transaction.transaction.id}
							className='productreportlist-table-row'
						>
							<span>
								{transaction.user_details?.firstName}{' '}
								{transaction.user_details?.lastName}
							</span>
							<span>{transaction.product.name}</span>
							<span>£{transaction.product.price}</span>
							<span>{transaction.transaction.quantity}</span>
							<span>
								{' '}
								{(
									transaction.transaction.quantity * transaction.product.price
								).toFixed(2)}
							</span>
							<span>{transaction.user_details.preferred_location?.name}</span>
							<span style={{ whiteSpace: 'nowrap' }}>
								{formatDate(transaction.transaction.created_at)}{' '}
								{transaction.transaction.created_at.split('T')[1].slice(0, 8)}
							</span>
						</div>
					))
				) : (
					<div className='productreportlist-no-data'>
						No transactions found.
					</div>
				)}
			</div>
		</div>
	);
};

export default ProductList;
