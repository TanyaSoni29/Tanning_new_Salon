/** @format */

import React, { useState, useMemo } from 'react';
import './ServiceusedList.css'; // Importing CSS
import { saveAs } from 'file-saver'; // For saving files
import jsPDF from 'jspdf'; // For generating PDFs
import { FaFileCsv, FaFilePdf } from 'react-icons/fa'; // Icons for CSV and PDF
import { formatDate } from '../../utils/formateDate';
import { useSelector } from 'react-redux';

const ServiceUsedList = ({
	useServiceTransaction = [], // Add a default value of an empty array to avoid null errors
	selectedLocation,
	setSelectedLocation,
	dateRange,
	setDateRange,
}) => {
	const [searchTerm, setSearchTerm] = useState('');
	const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' }); // Sorting state

	// Helper function to format date for input fields (YYYY-MM-DD)
	const formatDateForInput = (date) => date.toISOString().slice(0, 10); // Return YYYY-MM-DD format

	const { locations } = useSelector((state) => state.location);

	// Extract unique locations for dropdown
	const uniqueLocations = [
		'All',
		...new Set(locations.map((location) => location.name)),
	];

	// Handle date range changes
	const handleDateRangeChange = (e) => {
		const { name, value } = e.target;
		setDateRange((prevRange) => ({
			...prevRange,
			[name]: value ? new Date(value) : null,
		}));
	};

	// Handle location change
	const handleLocationChange = (e) => setSelectedLocation(e.target.value);

	// Handle sorting logic
	const handleSort = (key) => {
		let direction = 'asc';
		if (sortConfig.key === key && sortConfig.direction === 'asc') {
			direction = 'desc';
		}
		setSortConfig({ key, direction });
	};

	// Filter and sort transactions based on search term, date range, and location
	const filteredTransaction = useMemo(() => {
		let sortedData = useServiceTransaction.filter((transaction) => {
			const serviceName = transaction?.serviceName?.toLowerCase() || '';
			const matchesSearchQuery = serviceName.includes(searchTerm.toLowerCase());
			const matchesLocation =
				selectedLocation === 'All' ||
				transaction.location?.name === selectedLocation;

			return matchesSearchQuery && matchesLocation;
		});

		// Sorting logic
		if (sortConfig.key) {
			sortedData = sortedData.sort((a, b) => {
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
	}, [useServiceTransaction, searchTerm, selectedLocation, sortConfig]);

	// Function to download CSV
	const handleDownloadCSV = () => {
		const headers = ['Date', 'Service Name', 'Location', 'Total Usage'];
		const csvRows = [
			headers.join(','), // header row
			...filteredTransaction.map((data) =>
				[
					formatDate(data.date), // Date
					data.serviceName, // Service Name
					data.location?.name || 'N/A', // Location
					data.total_quantity, // Total Usage
				].join(',')
			),
		].join('\n');

		const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
		saveAs(blob, 'service-used.csv');
	};

	// Function to download PDF with better formatting
	const handleDownloadPDF = () => {
		const doc = new jsPDF('p', 'pt', 'a4'); // A4 size PDF in portrait mode
		const pageWidth = doc.internal.pageSize.width;
		const pageHeight = doc.internal.pageSize.height;
		const leftMargin = 20; // Left margin for content
		const rightMargin = 20; // Right margin for content
		const tableTop = 60; // Starting point for the table
		const rowHeight = 20; // Fixed height for each row
		const colWidths = [100, 150, 100, 80]; // Column widths (adjust as needed)
		let currentY = tableTop;

		// Set title
		doc.setFont('helvetica', 'bold');
		doc.setFontSize(18);
		doc.text('Service Used Report', pageWidth / 2, 40, { align: 'center' });

		// Table headers
		const headers = ['Date', 'Service Name', 'Location', 'Total Usage'];
		doc.setFont('helvetica', 'bold');
		doc.setFontSize(12);
		drawTableRow(doc, headers, currentY, colWidths);
		currentY += rowHeight;

		// Draw rows
		doc.setFont('helvetica', 'normal');
		doc.setFontSize(10);

		filteredTransaction.forEach((transaction, index) => {
			const row = [
				formatDate(transaction.date),
				transaction.serviceName,
				transaction.location?.name || 'N/A',
				`${transaction.total_quantity}`,
			];

			drawTableRow(doc, row, currentY, colWidths);

			currentY += rowHeight;

			// If we reach the bottom of the page, add a new page
			if (currentY > pageHeight - rowHeight * 2) {
				doc.addPage();
				currentY = tableTop; // Reset Y position after new page
				// Draw table headers on each new page
				drawTableRow(doc, headers, currentY, colWidths);
				currentY += rowHeight;
			}
		});

		// Save the PDF
		doc.save('service-used.pdf');
	};

	// Function to draw a single row with borders
	const drawTableRow = (doc, rowData, y, colWidths) => {
		const startX = 20; // Left margin for the table
		let currentX = startX;

		rowData.forEach((data, index) => {
			doc.text(data, currentX + 5, y + 15); // Add 5px padding inside the cell
			doc.rect(currentX, y, colWidths[index], 20); // Draw cell borders
			currentX += colWidths[index];
		});
	};

	return (
		<div className='serviceused-container'>
			<div className='filter-serviceused'>
				<div className='serviceused-search-container'>
					<input
						type='text'
						placeholder='Search'
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
				<div className='date-range'>
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

				<div className='servicelocation-select'>
					<select value={selectedLocation} onChange={handleLocationChange}>
						{uniqueLocations.map((location) => (
							<option key={location} value={location}>
								{location}
							</option>
						))}
					</select>
				</div>

				<div className='serviceused-files'>
					<div className='serviceused-download' onClick={handleDownloadCSV}>
						<FaFileCsv size={35} style={{ color: '#28a745' }} />
					</div>
					<div className='serviceused-download' onClick={handleDownloadPDF}>
						<FaFilePdf size={35} style={{ color: '#dc3545' }} />
					</div>
				</div>
			</div>

			<div className='serviceused-table'>
				<div className='serviceused-table-header'>
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
						<span onClick={() => handleSort('total_quantity')}>
						Total Usage{' '}
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
						<div key={i} className='serviceused-table-row'>
							<span data-label='Date' style={{ whiteSpace: 'nowrap' }}>
								{formatDate(transaction.date)}
							</span>
							<span data-label='Service Name'>{transaction.serviceName}</span>
							<span data-label='Location'>{transaction.location?.name}</span>
							<span data-label='Total Usage'>{transaction.total_quantity}</span>
						</div>
					))
				) : (
					<div className='serviceused-no-data'>No service transaction found.</div>
				)}
			</div>
		</div>
	);
};

export default ServiceUsedList;
