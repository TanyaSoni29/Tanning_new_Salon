/** @format */

import React, { useState } from 'react';
import './ServiceusedList.css'; // Importing CSS
import { saveAs } from 'file-saver'; // For saving files
import jsPDF from 'jspdf'; // For generating PDFs
import { FaFileCsv, FaFilePdf } from 'react-icons/fa'; // Icons for CSV and PDF
import { formatDate } from '../../utils/formateDate';
import { useSelector } from 'react-redux';

const ServiceUsedList = ({ useServiceTransaction }) => {
	const [searchTerm, setSearchTerm] = useState('');

	// Helper function to format date for input fields (YYYY-MM-DD)
	const formatDateForInput = (date) => date.toISOString().slice(0, 10); // Return YYYY-MM-DD format

	// Set the default date range: startDate as the 1st of the current month and endDate as today
	const getCurrentMonthRange = () => {
		const now = new Date();
		const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
		return {
			startDate: startOfMonth,
			endDate: now,
		};
	};

	const [dateRange, setDateRange] = useState(getCurrentMonthRange());
	const [selectedLocation, setSelectedLocation] = useState('All');
	const { locations } = useSelector((state) => state.location);

	// Extract unique locations for dropdown
	const uniqueLocations = ['All', ...new Set(locations.map((location) => location.name))];

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
		const transactionDate = new Date(transaction.date);
		const isInDateRange =
			dateRange.startDate && dateRange.endDate
				? transactionDate >= dateRange.startDate && transactionDate <= dateRange.endDate
				: true;

		const serviceName = transaction?.service_name?.toLowerCase() || '';
		const matchesSearchQuery = serviceName.includes(searchTerm.toLowerCase());
		const matchesLocation =
			selectedLocation === 'All' || transaction.location?.name === selectedLocation;

		return isInDateRange && matchesSearchQuery && matchesLocation;
	});

	// Function to download CSV
	const handleDownloadCSV = () => {
		const headers = ['Service Name', 'Quantity', 'Location', 'Date/Time'];
		const csvRows = [
			headers.join(','), // header row
			...filteredTransaction.map((data) =>
				[
					data.service_name,
					data.total_quantity,
					data.location?.name || 'N/A',
					formatDate(data.date),
				].join(',')
			),
		].join('\n');

		const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
		saveAs(blob, 'service-used.csv');
	};

	// Function to download PDF
	const handleDownloadPDF = () => {
		const doc = new jsPDF('p', 'pt', 'a4'); // Create PDF with portrait mode and A4 size
		const pageHeight = doc.internal.pageSize.height;
		const lineHeight = 20;
		let row = 40; // Start position for content

		doc.setFont('helvetica', 'bold');
		doc.text('Service Used Report', 20, 20); // Title

		// Table headers
		doc.text('Service Name', 20, row);
		doc.text('Quantity', 200, row);
		doc.text('Location', 280, row);
		doc.text('Date/Time', 400, row);
		row += lineHeight;

		// Reset font to normal for content
		doc.setFont('helvetica', 'normal');

		filteredTransaction.forEach((transaction) => {
			// Check if the content exceeds the page, then add a new page
			if (row > pageHeight - lineHeight) {
				doc.addPage();
				row = 40; // Reset row for the new page

				// Re-add headers to the new page
				doc.setFont('helvetica', 'bold');
				doc.text('Service Name', 20, row);
				doc.text('Quantity', 200, row);
				doc.text('Location', 280, row);
				doc.text('Date/Time', 400, row);
				row += lineHeight;
				doc.setFont('helvetica', 'normal');
			}

			// Add transaction data
			doc.text(transaction.service_name, 20, row);
			doc.text(`${transaction.total_quantity}`, 200, row);
			doc.text(transaction.location?.name || 'N/A', 280, row);
			doc.text(formatDate(transaction.date), 400, row);
			row += lineHeight;
		});

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
						<FaFileCsv size={35} style={{ color: '#28a745' }} /> {/* Green for CSV */}
					</div>
					<div className='serviceused-download' onClick={handleDownloadPDF}>
						<FaFilePdf size={35} style={{ color: '#dc3545' }} /> {/* Red for PDF */}
					</div>
				</div>
			</div>

			<div className='serviceused-table'>
				<div className='serviceused-table-header'>
					<span>Service Name</span>
					<span>Location</span>
					<span>Total Usage</span>
					<span>Last Used</span>
				</div>

				{filteredTransaction.length > 0 ? (
					filteredTransaction.map((transaction, i) => (
						<div key={i} className='serviceused-table-row'>
							<span>{transaction.service_name}</span>
							<span>{transaction.location?.name}</span>
							<span>{transaction.total_quantity}</span>
							<span style={{ whiteSpace: 'nowrap' }}>{formatDate(transaction.date)}</span>
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
