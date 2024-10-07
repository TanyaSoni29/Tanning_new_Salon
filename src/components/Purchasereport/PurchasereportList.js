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

	// Download PDF with proper formatting
	const handleDownloadPDF = () => {
		const doc = new jsPDF('p', 'pt', 'a4'); // Use A4 page size in points (595.28 x 841.89)
		const pageWidth = doc.internal.pageSize.getWidth(); // Get page width
		const pageHeight = doc.internal.pageSize.getHeight(); // Get page height
		const margin = 40; // Set margin for the document
		const rowHeight = 20; // Set row height for table rows
		const headerHeight = 30; // Height for the header
		let currentY = margin + headerHeight; // Starting y-position for content

		// Define column widths and positions
		const columns = {
			date: margin,
			serviceName: margin + 100,
			location: margin + 250,
			totalValue: margin + 400,
			minutesSold: margin + 500,
		};

		// Set title
		doc.setFont('helvetica', 'bold');
		doc.setFontSize(18);
		doc.text('Service Purchase Report', pageWidth / 2, margin, { align: 'center' });

		// Table headers
		doc.setFontSize(12);
		doc.setFont('helvetica', 'bold');
		doc.text('Date', columns.date, currentY);
		doc.text('Service Name', columns.serviceName, currentY);
		doc.text('Location', columns.location, currentY);
		doc.text('Total Value', columns.totalValue, currentY);
		doc.text('Minutes Sold', columns.minutesSold, currentY);

		// Move to the next row for table data
		currentY += rowHeight;

		// Reset font for table data
		doc.setFont('helvetica', 'normal');

		// Loop through filtered transactions and add each row
		filteredTransaction.forEach((transaction) => {
			// Check if adding new row exceeds the page height, and if so, add a new page
			if (currentY + rowHeight > pageHeight - margin) {
				doc.addPage(); // Add new page
				currentY = margin + headerHeight; // Reset row for new page

				// Re-add the table headers on the new page
				doc.setFont('helvetica', 'bold');
				doc.text('Date', columns.date, currentY);
				doc.text('Service Name', columns.serviceName, currentY);
				doc.text('Location', columns.location, currentY);
				doc.text('Total Value', columns.totalValue, currentY);
				doc.text('Minutes Sold', columns.minutesSold, currentY);
				currentY += rowHeight;
				doc.setFont('helvetica', 'normal');
			}

			// Add transaction data
			doc.text(formatDate(transaction.date), columns.date, currentY);
			doc.text(transaction.serviceName, columns.serviceName, currentY);
			doc.text(transaction.location?.name || 'N/A', columns.location, currentY);
			doc.text(`£${transaction.total_price.toFixed(2)}`, columns.totalValue, currentY);
			doc.text(`${transaction.total_quantity}`, columns.minutesSold, currentY);

			// Move to the next row
			currentY += rowHeight;
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
								sortConfig.key === 'serviceName' &&
								sortConfig.direction === 'asc'
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
								sortConfig.key === 'total_price' &&
								sortConfig.direction === 'asc'
									? 'up'
									: 'down'
							}`}
						></i>
					</span>
					<span onClick={() => handleSort('total_quantity')}>
						Minutes Sold{' '}
						<i
							className={`fa fa-caret-${
								sortConfig.key === 'total_quantity' &&
								sortConfig.direction === 'asc'
									? 'up'
									: 'down'
							}`}
						></i>
					</span>
				</div>

				{filteredTransaction.length > 0 ? (
					filteredTransaction.map((transaction, i) => (
						<div
							key={i}
							className='purchasereportlist-table-row'
						>
							<span
								data-label='Date'
								style={{ whiteSpace: 'nowrap' }}
							>
								{formatDate(transaction.date)}
							</span>
							<span data-label='Service Name'>{transaction.serviceName}</span>
							<span data-label='Location'>{transaction.location?.name}</span>
							<span data-label='Total Value'>
								£{transaction.total_price.toFixed(2)}
							</span>
							<span data-label='Minutes Sold'>
								{transaction.total_quantity}
							</span>
						</div>
					))
				) : (
					<div className='purchasereportlist-no-data'>
						No service transactions found.
					</div>
				)}
			</div>
		</div>
	);
};

export default ProductList;
