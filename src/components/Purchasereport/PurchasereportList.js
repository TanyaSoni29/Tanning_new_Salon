/** @format */

import React, { useState, useMemo } from 'react';
import './PurchasereportList.css'; // Importing CSS
import { saveAs } from 'file-saver'; // For saving files
import jsPDF from 'jspdf'; // For generating PDFs
import { FaFileCsv, FaFilePdf } from 'react-icons/fa'; // Icons for CSV and PDF
import { useSelector } from 'react-redux';
import { formatDate } from '../../utils/formateDate';

const ProductList = ({
	purchaseServiceTransaction,
	selectedLocation,
	setSelectedLocation,
	dateRange,
	setDateRange,
}) => {
	// Helper function to format date for input fields (YYYY-MM-DD)
	const formatDateForInput = (date) => {
		return date.toISOString().slice(0, 10); // Return YYYY-MM-DD format
	};

	// Set the default date range: startDate as the 1st of the current month and endDate as today
	// const getCurrentMonthRange = () => {
	// 	const now = new Date();
	// 	const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 2);
	// 	const today = new Date();
	// 	return {
	// 		startDate: startOfMonth,
	// 		endDate: today,
	// 	};
	// };

	// const [dateRange, setDateRange] = useState(getCurrentMonthRange());
	// const [selectedLocation, setSelectedLocation] = useState('All');
	const { locations } = useSelector((state) => state.location);
	const [searchTerm, setSearchTerm] = useState('');

	// Extract unique locations for dropdown
	const uniqueLocations = useMemo(
		() => ['All', ...new Set(locations.map((location) => location.name))],
		[locations]
	);

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
	const filteredTransaction = purchaseServiceTransaction.filter(
		(transaction) => {
			// const transactionDate = new Date(transaction.date);
			// const isInDateRange =
			// 	dateRange.startDate && dateRange.endDate
			// 		? transactionDate >= dateRange.startDate &&
			// 		  transactionDate <= dateRange.endDate
			// 		: true;
			const serviceName = transaction?.service_name?.toLowerCase() || '';
			const matchesSearchQuery = serviceName?.includes(
				searchTerm?.toLowerCase()
			);
			const matchesLocation =
				selectedLocation === 'All' ||
				transaction.location?.name === selectedLocation;

			return matchesSearchQuery && matchesLocation;
		}
	);

	// Download CSV
	const handleDownloadCSV = () => {
		const headers = [
			'Service Name',
			'Location',
			'Total Value',
			'Minutes Sold',
			// 'Last Sold On',
		];
		const csvRows = [
			headers.join(','), // header row
			...filteredTransaction.map((data) =>
				[
					data.service_name,
					data.location?.name || 'N/A',
					`£${data.total_price.toFixed(2)}`, // Format total value with currency
					data.total_quantity,
					// formatDate(data.date),
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
			serviceName: margin, // First column starts from the left margin
			location: margin + 160, // Adjust column width based on content
			totalValue: margin + 300,
			minutesSold: margin + 400,
			// lastSoldOn: margin + 500,
		};

		doc.setFontSize(12);
		doc.setFont('helvetica', 'bold');
		doc.text('Service Purchase Report', margin, margin); // Title at the top

		// Add table headers
		doc.setFontSize(10);
		doc.text('Service Name', columns.serviceName, row);
		doc.text('Location', columns.location, row);
		doc.text('Total Value', columns.totalValue, row);
		doc.text('Minutes Sold', columns.minutesSold, row);
		// doc.text('Last Sold', columns.lastSoldOn, row);

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
				doc.text('Service Name', columns.serviceName, row);
				doc.text('Location', columns.location, row);
				doc.text('Total Value', columns.totalValue, row);
				doc.text('Minutes Sold', columns.minutesSold, row);
				// doc.text('Last Sold On', columns.lastSoldOn, row);
				row += lineHeight;
				doc.setFont('helvetica', 'normal');
			}

			// Add transaction data in the respective columns
			doc.text(transaction.service_name, columns.serviceName, row);
			doc.text(transaction.location?.name || 'N/A', columns.location, row);
			doc.text(
				`£${transaction.total_price.toFixed(2)}`,
				columns.totalValue,
				row
			);
			doc.text(`${transaction.total_quantity}`, columns.minutesSold, row);
			// doc.text(formatDate(transaction.date), columns.lastSoldOn, row);

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
					{/* Date range inputs with default values set to the current month */}
					<input
						type='date'
						name='startDate'
						value={formatDateForInput(dateRange.startDate)}
						placeholder='Start Date'
						onChange={handleDateRangeChange}
					/>
					<input
						type='date'
						name='endDate'
						value={formatDateForInput(dateRange.endDate)}
						placeholder='End Date'
						onChange={handleDateRangeChange}
					/>
				</div>
				<div className='purchaselocation-select'>
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
				<div className='purchasereportlist-files'>
					<div
						className='purchasereportlist-download'
						onClick={handleDownloadCSV}
					>
						<FaFileCsv
							size={35}
							style={{ color: '#28a745' }}
						/>{' '}
						{/* Green for CSV */}
					</div>
					<div
						className='purchasereportlist-download'
						onClick={handleDownloadPDF}
					>
						<FaFilePdf
							size={35}
							style={{ color: '#dc3545' }}
						/>{' '}
						{/* Red for PDF */}
					</div>
				</div>
			</div>

			<div className='purchasereportlist-table'>
				<div className='purchasereportlist-table-header'>
					<span>Service Name</span>
					<span>Location</span>
					<span>Total Value</span>
					<span>Minutes Sold</span>
					{/* <span>Last Sold On</span> */}
				</div>

				{filteredTransaction.length > 0 ? (
					filteredTransaction.map((transaction, i) => (
						<div
							key={i}
							className='purchasereportlist-table-row'
						>
							<span>{transaction.service_name}</span>
							<span>{transaction.location?.name}</span>
							<span>£{transaction.total_price.toFixed(2)}</span>
							<span>{transaction.total_quantity}</span>
							{/* <span style={{ whiteSpace: 'nowrap' }}>
								{formatDate(transaction.date)}
							</span> */}
						</div>
					))
				) : (
					<div className='purchasereportlist-no-data'>
						No transactions found.
					</div>
				)}
			</div>
		</div>
	);
};

export default ProductList;
