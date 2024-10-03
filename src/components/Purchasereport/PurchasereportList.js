/** @format */

import React, { useState } from 'react';
import './PurchasereportList.css'; // Importing CSS
import { saveAs } from 'file-saver'; // For saving files
import jsPDF from 'jspdf'; // For generating PDFs
import { FaFileCsv, FaFilePdf } from 'react-icons/fa'; // Icons for CSV and PDF
import { useSelector } from 'react-redux';
import { formatDate } from '../../utils/formateDate';

const ProductList = ({ purchaseServiceTransaction }) => {
	const [dateRange, setDateRange] = useState({
		startDate: null,
		endDate: null,
	});
	const [selectedLocation, setSelectedLocation] = useState('All');
	const { locations } = useSelector((state) => state.location);
	const [searchTerm, setSearchTerm] = useState('');

	// Extract unique locations for dropdown
	const uniqueLocations = ['All', ...new Set(locations.map((location) => location.name))];

	// Handle Date Range Change
	const handleDateRangeChange = (e) => {
		const { name, value } = e.target;
		setDateRange((prevRange) => ({
			...prevRange,
			[name]: value ? new Date(value) : null,
		}));
	};

	// Handle Location Change
	const handleLocationChange = (e) => {
		setSelectedLocation(e.target.value);
	};

	// Filter Transactions
	const filteredTransaction = purchaseServiceTransaction.filter((transaction) => {
		const transactionDate = new Date(transaction.transaction.created_at);
		const isInDateRange =
			dateRange.startDate && dateRange.endDate
				? transactionDate >= dateRange.startDate && transactionDate <= dateRange.endDate
				: true;
		const firstName = transaction?.user_details?.firstName?.toLowerCase() || '';
		const lastName = transaction?.user_details?.lastName?.toLowerCase() || '';
		const serviceName = transaction?.service?.name?.toLowerCase() || '';
		const matchesSearchQuery =
			`${firstName} ${lastName}`.includes(searchTerm.toLowerCase()) ||
			serviceName.includes(searchTerm.toLowerCase());
		const matchesLocation =
			selectedLocation === 'All' || transaction.user_details?.preferred_location?.name === selectedLocation;

		return isInDateRange && matchesSearchQuery && matchesLocation;
	});

	// Download CSV
	const handleDownloadCSV = () => {
		const headers = ['User Name', 'Service Name', 'Price', 'Quantity', 'Location', 'Date/Time'];
		const csvRows = [
			headers.join(','), // header row
			...filteredTransaction.map((data) =>
				[
					`${data.user_details.firstName} ${data.user_details.lastName}`,
					data.service.name,
					data.service.price,
					data.transaction.quantity,
					data.user_details.preferred_location?.name,
					formatDate(data.transaction.created_at),
				].join(',')
			),
		].join('\n');

		const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
		saveAs(blob, 'service-purchase.csv');
	};

	// Download PDF
	const handleDownloadPDF = () => {
		const doc = new jsPDF('p', 'pt', 'a4'); // Use A4 page size in points (595.28 x 841.89)
		const pageWidth = doc.internal.pageSize.getWidth(); // Get page width
		const pageHeight = doc.internal.pageSize.getHeight(); // Get page height
		const margin = 40; // Set margin for the document
		const lineHeight = 20; // Set line height for table rows
		const headerHeight = 30; // Height for the header
		let row = margin + headerHeight; // Starting y-position for content

		// Define the column positions to fit within the page width
		const columns = {
			userName: margin, // First column starts from left margin
			serviceName: margin + 80, // Next column 80pt from the first one
			price: margin + 220, // Adjust based on previous column widths
			quantity: margin + 280,
			location: margin + 340,
			dateTime: margin + 450, // Adjust this so it fits within the page
		};

		doc.setFontSize(12);
		doc.setFont('helvetica', 'bold');
		doc.text('Service Purchase Report', margin, margin); // Title at the top

		// Add table headers
		doc.setFontSize(10);
		doc.text('User Name', columns.userName, row);
		doc.text('Service', columns.serviceName, row);
		doc.text('Price', columns.price, row);
		doc.text('Quantity', columns.quantity, row);
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
				doc.text('Service', columns.serviceName, row);
				doc.text('Price', columns.price, row);
				doc.text('Quantity', columns.quantity, row);
				doc.text('Location', columns.location, row);
				doc.text('Date/Time', columns.dateTime, row);
				row += lineHeight;
				doc.setFont('helvetica', 'normal');
			}

			// Add transaction data in the respective columns
			doc.text(`${transaction.user_details.firstName} ${transaction.user_details.lastName}`, columns.userName, row);
			doc.text(transaction.service?.name, columns.serviceName, row);
			doc.text(`${transaction.service.price}`, columns.price, row);
			doc.text(`${transaction.transaction.quantity}`, columns.quantity, row);
			doc.text(transaction.user_details.preferred_location?.name || 'N/A', columns.location, row);
			doc.text(formatDate(transaction.transaction.created_at), columns.dateTime, row);

			// Move to the next row
			row += lineHeight;
		});

		doc.save('service-purchase.pdf'); // Save the generated PDF
	};

	return (
		<div className='purchasereportlist-container'>
			<div className='filter-purchase'>
			<div className='purchasereportlist-search-container'>
				<input
					type='text'
					placeholder='Search'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
			</div>
				<div className='sedate-range'>
					<input type='date' name='startDate' placeholder='Start Date' onChange={handleDateRangeChange} />
					<input type='date' name='endDate' placeholder='End Date' onChange={handleDateRangeChange} />
				</div>
				<div className='purchaselocation-select'>
					<select value={selectedLocation} onChange={handleLocationChange}>
						{uniqueLocations.map((location) => (
							<option key={location} value={location}>
								{location}
							</option>
						))}
					</select>
				</div>
				<div className='purchasereportlist-files'>
					<div className='purchasereportlist-download' onClick={handleDownloadCSV}>
						<FaFileCsv size={45} style={{ color: '#28a745' }} /> {/* Green for CSV */}
					</div>
					<div className='purchasereportlist-download' onClick={handleDownloadPDF}>
						<FaFilePdf size={45} style={{ color: '#dc3545' }} /> {/* Red for PDF */}
					</div>
				</div>
			
			</div>

			<div className='purchasereportlist-table'>
				<div className='purchasereportlist-table-header'>
					<span>USER NAME</span>
					<span>SERVICE NAME</span>
					<span>PRICE</span>
					<span>QUANTITY</span>
					<span>LOCATION</span>
					<span>DATE/TIME</span>
				</div>

				{filteredTransaction.length > 0 ? (
					filteredTransaction.map((transaction) => (
						<div key={transaction.transaction.id} className='purchasereportlist-table-row'>
							<span>
								{transaction.user_details?.firstName} {transaction.user_details?.lastName}
							</span>
							<span>{transaction.service.name}</span>
							<span>{transaction.service.price}</span>
							<span>{transaction.transaction.quantity}</span>
							<span>{transaction.user_details.preferred_location?.name}</span>
							<span style={{ whiteSpace: 'nowrap' }}>
								{formatDate(transaction.transaction.created_at)}{' '}
								{transaction.transaction.created_at.split('T')[1].slice(0, 8)}
							</span>
						</div>
					))
				) : (
					<div className='purchasereportlist-no-data'>No transactions found.</div>
				)}
			</div>
		</div>
	);
};

export default ProductList;
