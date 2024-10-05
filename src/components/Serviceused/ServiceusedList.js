/** @format */

import React, { useState } from 'react';
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

	// Filter transactions based on search term, date range, and location
	const filteredTransaction = useServiceTransaction.filter((transaction) => {
		const serviceName = transaction?.serviceName?.toLowerCase() || '';
		const matchesSearchQuery = serviceName.includes(searchTerm.toLowerCase());
		const matchesLocation =
			selectedLocation === 'All' ||
			transaction.location?.name === selectedLocation;

		return matchesSearchQuery && matchesLocation;
	});

	// Function to download CSV
	const handleDownloadCSV = () => {
		const headers = ['Service Name', 'Location', 'Total Usage', 'Last Used'];
		const csvRows = [
			headers.join(','), // header row
			...filteredTransaction.map((data) =>
				[
					data.serviceName,
					data.total_quantity,
					data.location?.name || 'N/A',
					formatDate(data.date),
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
		const lineHeight = 20;
		let row = 60; // Start position for content
		const leftMargin = 20; // Left margin for content

		// Set title
		doc.setFont('helvetica', 'bold');
		doc.setFontSize(18);
		doc.text('Service Used Report', pageWidth / 2, 40, { align: 'center' }); // Centered title

		// Table column headers
		const headers = ['Service Name', 'Location', 'Total Usage', 'Last Used'];
		const headerX = [leftMargin, 200, 300, 400]; // Adjusting X positions for columns
		doc.setFontSize(12);
		doc.text(headers[0], headerX[0], row);
		doc.text(headers[1], headerX[1], row);
		doc.text(headers[2], headerX[2], row);
		doc.text(headers[3], headerX[3], row);
		row += lineHeight; // Move to next line

		doc.setFont('helvetica', 'normal');
		doc.setFontSize(10);

		filteredTransaction.forEach((transaction) => {
			const transactionDate = formatDate(transaction.date);

			// Check if the content exceeds the page, add a new page if necessary
			if (row > pageHeight - lineHeight * 2) {
				doc.addPage();
				row = 60; // Reset row for new page

				// Re-add headers to the new page
				doc.setFont('helvetica', 'bold');
				doc.text(headers[0], headerX[0], row);
				doc.text(headers[1], headerX[1], row);
				doc.text(headers[2], headerX[2], row);
				doc.text(headers[3], headerX[3], row);
				row += lineHeight; // Move to next line
				doc.setFont('helvetica', 'normal');
			}

			// Add transaction data
			doc.text(transaction.serviceName, headerX[0], row); // Service name (left aligned)
			doc.text(transaction.location?.name || 'N/A', headerX[1], row); // Location
			doc.text(`${transaction.total_quantity}`, headerX[2], row, {
				align: 'right',
			}); // Total Usage (right aligned)
			doc.text(transactionDate, headerX[3], row); // Last Used
			row += lineHeight;
		});

		// Save the PDF
		doc.save('service-used.pdf');
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
					<select
						value={selectedLocation}
						onChange={handleLocationChange}
					>
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
		<span>Date</span>
		<span>Service Name</span>
		<span>Location</span>
		<span>Total Usage</span>
	</div>

	{filteredTransaction.length > 0 ? (
		filteredTransaction.map((transaction, i) => (
			<div key={i} className='serviceused-table-row'>
				<span data-label="Date" style={{ whiteSpace: 'nowrap' }}>
					{formatDate(transaction.date)}
				</span>
				<span data-label="Service Name">{transaction.serviceName}</span>
				<span data-label="Location">{transaction.location?.name}</span>
				<span data-label="Total Usage">{transaction.total_quantity}</span>
			</div>
		))
	) : (
		<div className='serviceused-no-data'>No transaction found.</div>
	)}
</div>


		</div>
	);
};

export default ServiceUsedList;
