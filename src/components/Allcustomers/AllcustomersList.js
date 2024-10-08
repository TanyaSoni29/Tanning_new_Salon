/** @format */

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import './AllcustomersList.css'; // Importing CSS
import { saveAs } from 'file-saver'; // For saving files
import jsPDF from 'jspdf'; // For generating PDFs
import { FaFileCsv, FaFilePdf } from 'react-icons/fa'; // Icons for CSV and PDF

const CustomerList = ({
	customerReportData = [],
	selectedLocation,
	setSelectedLocation,
	dateRange,
	setDateRange,
	getCurrentMonthRange,
}) => {
	const { locations } = useSelector((state) => state.location);
	const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' }); // Sorting state
	const [isCurrentMonth, setIsCurrentMonth] = useState(false);

	const uniqueLocations = [
		'All',
		...new Set(locations.map((location) => location.name)),
	];

	useEffect(() => {
		if (isCurrentMonth) {
			setDateRange(getCurrentMonthRange());
		}
	}, [isCurrentMonth]);

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

	// Handle sorting logic
	const handleSort = (key) => {
		let direction = 'asc';
		if (sortConfig.key === key && sortConfig.direction === 'asc') {
			direction = 'desc';
		}
		setSortConfig({ key, direction });
	};

	// Sort and filter the customer list
	const filteredCustomers = customerReportData
		?.filter((data) => {
			const matchesLocation =
				selectedLocation === 'All' ||
				(data?.location_name && data?.location_name === selectedLocation);
			return matchesLocation;
		})
		.sort((a, b) => {
			if (sortConfig.key) {
				const aValue = a[sortConfig.key] || '';
				const bValue = b[sortConfig.key] || '';

				if (aValue < bValue) {
					return sortConfig.direction === 'asc' ? -1 : 1;
				}
				if (aValue > bValue) {
					return sortConfig.direction === 'asc' ? 1 : -1;
				}
				return 0;
			}
			return 0;
		});

	// Function to download CSV (with UTF-8 BOM to ensure proper encoding)
	const handleDownloadCSV = () => {
		const headers = ['LOCATION', 'WEEK NO.', 'COUNT', 'TOTAL SPENT'];

		const csvRows = [
			headers.join(','), // header row
			...filteredCustomers.map((customer) => {
				const rowData = [
					customer?.location_name ? customer?.location_name : 'N/A',
					customer.week_no || '0',
					customer?.total_registered_customers || '0',
					customer.spent ? `£${customer.spent.toFixed(2)}` : '£0.00',
				];
				return rowData.join(',');
			}),
		].join('\n');

		// Add UTF-8 BOM for encoding support to handle special characters properly
		const blob = new Blob([`\uFEFF${csvRows}`], { type: 'text/csv;charset=utf-8;' });
		saveAs(blob, 'Customers.csv');
	};

	// Function to download PDF
	const handleDownloadPDF = () => {
		const doc = new jsPDF('p', 'pt', 'a4'); // Use A4 page size in points
		const pageWidth = doc.internal.pageSize.getWidth(); // Get page width
		const pageHeight = doc.internal.pageSize.getHeight(); // Get page height
		const margin = 40; // Set margin for the document
		const rowHeight = 25; // Set row height for table rows
		const headerHeight = 30; // Set the height for the header
		const colWidths = [140, 80, 80, 120]; // Widths for each column (Location, Week No., Count, Total Spent)
		let currentY = margin + headerHeight; // Start position for the content

		// Set title
		doc.setFont('helvetica', 'bold');
		doc.setFontSize(18);
		doc.text('Customer Report', pageWidth / 2, margin, { align: 'center' });

		// Define headers and draw them
		const headers = ['Location', 'Week No.', 'Count', 'Total Spent'];
		doc.setFontSize(12);
		doc.setFont('helvetica', 'bold');
		drawTableRow(doc, headers, currentY, colWidths, true);
		currentY += rowHeight;

		// Reset font for table data
		doc.setFont('helvetica', 'normal');

		// Loop through filtered customers and add each row
		filteredCustomers.forEach((customer) => {
			const row = [
				customer?.location_name ? customer?.location_name : 'N/A',
				customer.week_no || '0',
				customer.total_registered_customers || '0',
				customer.spent ? `£${customer.spent.toFixed(2)}` : '£0.00',
			];

			// Check if adding the new row will exceed the page height
			if (currentY + rowHeight > pageHeight - margin) {
				doc.addPage(); // Add a new page
				currentY = margin + headerHeight; // Reset position for new page
				// Redraw table headers on the new page
				doc.setFont('helvetica', 'bold');
				drawTableRow(doc, headers, currentY, colWidths, true);
				currentY += rowHeight;
				doc.setFont('helvetica', 'normal'); // Reset font
			}

			// Draw the row
			drawTableRow(doc, row, currentY, colWidths);
			currentY += rowHeight;
		});

		// Save the PDF
		doc.save('Customers.pdf');
	};

	// Function to draw a single row with borders and centered text
	const drawTableRow = (doc, rowData, y, colWidths, isHeader = false) => {
		const startX = 40; // Left margin for the table
		let currentX = startX;

		rowData.forEach((data, index) => {
			const colWidth = colWidths[index];
			const text = String(data);

			// Draw the cell borders
			doc.rect(currentX, y, colWidth, 25); // Draw the rectangle for each cell

			// Center the text inside the cell horizontally and vertically
			const textWidth = doc.getTextWidth(text);
			const textX = currentX + colWidth / 2 - textWidth / 2; // Center horizontally
			const textY = y + (isHeader ? 18 : 15); // Adjust vertically for headers
			doc.text(text, textX, textY); // Draw the text

			currentX += colWidth; // Move to the next column
		});
	};

	return (
		<div className='allcustomer-container'>
			<div className='filter-customer'>
				<div className='allcustomer-date-range-inputs'>
					<input
						type='date'
						name='startDate'
						value={dateRange.startDate?.toISOString().substring(0, 10)}
						placeholder='Start Date'
						onChange={handleDateRangeChange}
					/>
					<input
						type='date'
						name='endDate'
						value={dateRange.endDate?.toISOString().substring(0, 10)}
						placeholder='End Date'
						onChange={handleDateRangeChange}
					/>
				</div>
				<div className='allcustomer-location-select'>
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

				<div className='allcustomer-files'>
					<div
						className='allcustomer-icon'
						onClick={handleDownloadCSV}
					>
						<FaFileCsv
							size={35}
							style={{ color: '#28a745' }}
						/>
					</div>
					<div
						className='allcustomer-icon'
						onClick={handleDownloadPDF}
					>
						<FaFilePdf
							size={35}
							style={{ color: '#dc3545' }}
						/>
					</div>
				</div>
			</div>

			<div className='allcustomer-table'>
				<div className='allcustomer-table-header'>
					<span onClick={() => handleSort('location_name')}>
						Location{' '}
						<i
							className={`fa fa-caret-${
								sortConfig.key === 'location_name' &&
								sortConfig.direction === 'asc'
									? 'up'
									: 'down'
							}`}></i>
					</span>
					<span onClick={() => handleSort('week_no')}>
						Week No.{' '}
						<i
							className={`fa fa-caret-${
								sortConfig.key === 'week_no' && sortConfig.direction === 'asc'
									? 'up'
									: 'down'
							}`}></i>
					</span>
					<span onClick={() => handleSort('total_registered_customers')}>
						Count{' '}
						<i
							className={`fa fa-caret-${
								sortConfig.key === 'total_registered_customers' &&
								sortConfig.direction === 'asc'
									? 'up'
									: 'down'
							}`}></i>
					</span>
					<span onClick={() => handleSort('spent')}>
						Total Spent{' '}
						<i
							className={`fa fa-caret-${
								sortConfig.key === 'spent' && sortConfig.direction === 'asc'
									? 'up'
									: 'down'
							}`}></i>
					</span>
				</div>

				{filteredCustomers.length > 0 ? (
					filteredCustomers.map((customer, i) => {
						return (
							<div
								key={i}
								className='allcustomer-table-row'>
								<span data-label='Location'>
									{customer?.location_name !== 'All'
										? customer?.location_name
										: '-'}
								</span>
								<span
									data-label='Week No.'
									className='customerregtb'>
									{customer?.week_no || '-'}
								</span>
								<span
									data-label='Count'
									className='customerregtb'>
									{customer?.total_registered_customers || '-'}
								</span>
								<span
									data-label='Total Spent'
									className='totalSpendb'>
									£{customer?.spent?.toFixed(2) || '0.00'}
								</span>
							</div>
						);
					})
				) : (
					<div className='allcustomer-no-data'>No Data found.</div>
				)}
			</div>
		</div>
	);
};

export default CustomerList;
