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

	// State for search term
	const [searchTerm, setSearchTerm] = useState('');

	// State for sorting configuration
	const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

	const { locations } = useSelector((state) => state.location);

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

	// Handle sorting logic
	const handleSort = (key) => {
		let direction = 'asc';
		if (sortConfig.key === key && sortConfig.direction === 'asc') {
			direction = 'desc';
		}
		setSortConfig({ key, direction });
	};

	// Sort and filter transactions
	const filteredTransaction = useMemo(() => {
		const sortedData = purchaseServiceTransaction.filter((transaction) => {
			const serviceName = transaction?.serviceName?.toLowerCase() || '';
			const matchesSearchQuery = serviceName?.includes(
				searchTerm?.toLowerCase()
			);
			const matchesLocation =
				selectedLocation === 'All' ||
				transaction.location?.name === selectedLocation;

			return matchesSearchQuery && matchesLocation;
		});

		// Sorting logic
		if (sortConfig.key) {
			sortedData.sort((a, b) => {
				const aValue = a[sortConfig.key] || '';
				const bValue = b[sortConfig.key] || '';

				if (aValue < bValue) {
					return sortConfig.direction === 'asc' ? -1 : 1;
				}
				if (aValue > bValue) {
					return sortConfig.direction === 'asc' ? 1 : -1;
				}
				return 0;
			});
		}

		return sortedData;
	}, [purchaseServiceTransaction, searchTerm, selectedLocation, sortConfig]);

	// Download CSV
	const handleDownloadCSV = () => {
		const headers = [
			'Date',
			'Service Name',
			'Location',
			'Total Value',
			'Minutes Sold',
		];
		const csvRows = [
			headers.join(','), // header row
			...filteredTransaction.map((data) =>
				[
					formatDate(data.date),
					data.serviceName,
					data.location?.name || 'N/A',
					`£${data.total_price.toFixed(2)}`, // Format total value with currency
					data.total_quantity,
				].join(',')
			),
		].join('\n');

		const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
		saveAs(blob, 'service-purchase.csv');
	};

	// Download PDF with proper formatting and gridlines
	const handleDownloadPDF = () => {
		const doc = new jsPDF('p', 'pt', 'a4'); // Use A4 page size in points (595.28 x 841.89)
		const pageWidth = doc.internal.pageSize.getWidth(); // Get page width
		const pageHeight = doc.internal.pageSize.getHeight(); // Get page height
		const margin = 40; // Set margin for the document
		const rowHeight = 20; // Set row height for table rows
		const headerHeight = 30; // Height for the header
		const cellPadding = 5; // Padding inside each cell
		let currentY = margin + headerHeight; // Starting y-position for content

		// Define column widths and positions
		const colWidths = [80, 140, 120, 100, 100]; // Widths for Date, Service Name, Location, Total Value, Minutes Sold

		// Draw table headers
		const headers = ['Date', 'Service Name', 'Location', 'Total Value', 'Minutes Sold'];
		
		// Set title
		doc.setFont('helvetica', 'bold');
		doc.setFontSize(18);
		doc.text('Service Purchase Report', pageWidth / 2, margin, { align: 'center' });

		// Draw the table header row
		doc.setFontSize(12);
		doc.setFont('helvetica', 'bold');
		drawTableRow(doc, headers, currentY, colWidths);
		currentY += rowHeight;

		// Reset font for table data
		doc.setFont('helvetica', 'normal');

		// Loop through filtered transactions and add each row
		filteredTransaction.forEach((transaction, index) => {
			const row = [
				formatDate(transaction.date),
				transaction.serviceName,
				transaction.location?.name || 'N/A',
				`£${transaction.total_price.toFixed(2)}`,
				transaction.total_quantity.toString(), // Ensure it's a string
			];

			// Check if adding a new row exceeds the page height, and if so, add a new page
			if (currentY + rowHeight > pageHeight - margin) {
				doc.addPage(); // Add new page
				currentY = margin + headerHeight; // Reset row for new page

				// Re-add the table headers on the new page
				doc.setFont('helvetica', 'bold');
				drawTableRow(doc, headers, currentY, colWidths);
				currentY += rowHeight;
				doc.setFont('helvetica', 'normal');
			}

			// Draw the current row
			drawTableRow(doc, row, currentY, colWidths);
			currentY += rowHeight;
		});

		doc.save('service-purchase.pdf'); // Save the generated PDF
	};

	// Function to draw a single row with borders
	const drawTableRow = (doc, rowData, y, colWidths) => {
		const startX = 40; // Left margin for the table
		let currentX = startX;

		rowData.forEach((data, index) => {
			const colWidth = colWidths[index];

			// Convert the data to a string to avoid errors
			const text = String(data);

			// Draw the cell borders
			doc.rect(currentX, y, colWidth, 20); // Draw the rectangle for each cell
			
			// Center the text inside the cell horizontally and vertically
			const textWidth = doc.getTextWidth(text);
			const textX = currentX + (colWidth / 2) - (textWidth / 2); // Center horizontally
			const textY = y + 15; // Center vertically within the cell
			doc.text(text, textX, textY); // Draw the text

			currentX += colWidth; // Move to the next column
		});
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
					<span onClick={() => handleSort('date')}>
						Date{' '}
						<i
							className={`fa fa-caret-${
								sortConfig.key === 'date' && sortConfig.direction === 'asc'
									? 'up'
									: 'down'
							}`}
						></i>
					</span>
					<span onClick={() => handleSort('serviceName')}>
						Service Name{' '}
						<i
							className={`fa fa-caret-${
								sortConfig.key === 'serviceName' && sortConfig.direction === 'asc'
									? 'up'
									: 'down'
							}`}
						></i>
					</span>
					<span onClick={() => handleSort('location')}>
						Location{' '}
						<i
							className={`fa fa-caret-${
								sortConfig.key === 'location' && sortConfig.direction === 'asc'
									? 'up'
									: 'down'
							}`}
						></i>
					</span>
					<span onClick={() => handleSort('total_price')}>
						Total Value{' '}
						<i
							className={`fa fa-caret-${
								sortConfig.key === 'total_price' && sortConfig.direction === 'asc'
									? 'up'
									: 'down'
							}`}
						></i>
					</span>
					<span onClick={() => handleSort('total_quantity')}>
						Minutes Sold{' '}
						<i
							className={`fa fa-caret-${
								sortConfig.key === 'total_quantity' && sortConfig.direction === 'asc'
									? 'up'
									: 'down'
							}`}
						></i>
					</span>
				</div>

				{filteredTransaction.length > 0 ? (
					filteredTransaction.map((transaction, i) => (
						<div key={i} className='purchasereportlist-table-row'>
							<span data-label="Date" style={{ whiteSpace: 'nowrap' }}>
								{formatDate(transaction.date)}
							</span>
							<span data-label="Service Name">{transaction.serviceName}</span>
							<span data-label="Location">{transaction.location?.name}</span>
							<span data-label="Total Value">£{transaction.total_price.toFixed(2)}</span>
							<span data-label="Minutes Sold">{transaction.total_quantity}</span>
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
