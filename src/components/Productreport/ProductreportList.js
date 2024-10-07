/** @format */

import React, { useState, useMemo, useCallback } from 'react';
import './ProductreportList.css'; // Importing CSS
import { saveAs } from 'file-saver'; // For saving files
import jsPDF from 'jspdf'; // For generating PDFs
import { FaFileCsv, FaFilePdf } from 'react-icons/fa'; // Icons for CSV and PDF
import { useSelector } from 'react-redux';
import { formatDate } from '../../utils/formateDate';

const ProductList = ({
	productTransaction,
	selectedLocation,
	setSelectedLocation,
	dateRange,
	setDateRange,
}) => {
	// Helper function to format date for input fields (YYYY-MM-DD)
	const formatDateForInput = (date) => {
		return date.toISOString().slice(0, 10); // Return YYYY-MM-DD format
	};

	const [searchTerm, setSearchTerm] = useState('');
	const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' }); // Sorting state

	const { locations } = useSelector((state) => state.location);

	// Extract unique locations for dropdown
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

	// Handle sorting logic
	const handleSort = (key) => {
		let direction = 'asc';
		if (sortConfig.key === key && sortConfig.direction === 'asc') {
			direction = 'desc';
		}
		setSortConfig({ key, direction });
	};

	// Sort and filter product transactions
	const filteredTransaction = useMemo(() => {
		const sortedData = productTransaction.filter((transaction) => {
			const productName = transaction?.product?.name?.toLowerCase() || '';
			const matchesSearchQuery = productName.includes(searchTerm.toLowerCase());
			const matchesLocation =
				selectedLocation === 'All' ||
				transaction.location?.name === selectedLocation;

			return matchesSearchQuery && matchesLocation;
		});

		// Sorting logic
		if (sortConfig.key) {
			sortedData.sort((a, b) => {
				const aValue = a[sortConfig.key] || a.product[sortConfig.key] || '';
				const bValue = b[sortConfig.key] || b.product[sortConfig.key] || '';

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
	}, [productTransaction, searchTerm, selectedLocation, sortConfig]);

	// Download CSV
	const handleDownloadCSV = () => {
		const headers = [
			'Product Name',
			'Location',
			'Total Value',
			'Total Sold',
			'Date',
		];
		const csvRows = [
			headers.join(','), // header row
			...filteredTransaction.map((data) =>
				[
					data.product.name,
					data.location?.name || 'N/A',
					`£${data.total_price.toFixed(2)}`, // Format total value with currency
					data.total_sold,
					formatDate(data.last_transaction_date),
				].join(',')
			),
		].join('\n');

		const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
		saveAs(blob, 'product-purchase.csv');
	};

	// Download PDF with proper formatting and gridlines
	const handleDownloadPDF = () => {
		const doc = new jsPDF('p', 'pt', 'a4'); // Use A4 page size in points
		const pageWidth = doc.internal.pageSize.getWidth(); // Get page width
		const pageHeight = doc.internal.pageSize.getHeight(); // Get page height
		const margin = 40; // Set margin for the document
		const rowHeight = 20; // Set row height for table rows
		let currentY = margin + 30; // Starting y-position for content

		// Define column widths and positions
		const colWidths = [140, 120, 100, 80, 100]; // Widths for Product Name, Location, Total Value, Total Sold, Date

		// Set title
		doc.setFont('helvetica', 'bold');
		doc.setFontSize(18);
		doc.text('Product Purchase Report', pageWidth / 2, margin, { align: 'center' });

		// Table headers
		const headers = ['Product Name', 'Location', 'Total Value', 'Total Sold', 'Date'];
		doc.setFontSize(12);
		doc.setFont('helvetica', 'bold');
		drawTableRow(doc, headers, currentY, colWidths);
		currentY += rowHeight;

		// Reset font for table data
		doc.setFont('helvetica', 'normal');

		// Loop through filtered transactions and add each row
		filteredTransaction.forEach((transaction) => {
			const row = [
				transaction.product?.name,
				transaction.location?.name || 'N/A',
				`£${transaction.total_price.toFixed(2)}`,
				transaction.total_sold.toString(),
				formatDate(transaction.last_transaction_date),
			];

			// Check if adding new row exceeds the page height, and if so, add a new page
			if (currentY + rowHeight > pageHeight - margin) {
				doc.addPage(); // Add new page
				currentY = margin + 30; // Reset row for new page

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

		doc.save('product-purchase.pdf'); // Save the generated PDF
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
				<div className='productlocation-select'>
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
							size={35}
							style={{ color: '#28a745' }}
						/>
					</div>
					<div
						className='productreportlist-download'
						onClick={handleDownloadPDF}
					>
						<FaFilePdf
							size={35}
							style={{ color: '#dc3545' }}
						/>
					</div>
				</div>
			</div>

			<div className='productreportlist-table'>
				<div className='productreportlist-table-header'>
					<span onClick={() => handleSort('last_transaction_date')}>
						Date{' '}
						<i
							className={`fa fa-caret-${
								sortConfig.key === 'last_transaction_date' &&
								sortConfig.direction === 'asc'
									? 'up'
									: 'down'
							}`}
						></i>
					</span>
					<span onClick={() => handleSort('name')}>
						Product Name{' '}
						<i
							className={`fa fa-caret-${
								sortConfig.key === 'name' && sortConfig.direction === 'asc'
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
					<span onClick={() => handleSort('total_sold')}>
						Total Sold{' '}
						<i
							className={`fa fa-caret-${
								sortConfig.key === 'total_sold' &&
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
							className='productreportlist-table-row'
						>
							<span
								style={{ whiteSpace: 'nowrap' }}
								data-label='Date'
							>
								{formatDate(transaction.last_transaction_date)}
							</span>
							<span data-label='Product Name'>{transaction.product.name}</span>
							<span data-label='Location'>{transaction.location.name}</span>
							<span data-label='Total Value' className='productvalu'>
								£{transaction.total_price.toFixed(2)}
							</span>
							<span data-label='Total Sold'  className='productvalu'>{transaction.total_sold}</span>
						</div>
					))
				) : (
					<div className='productreportlist-no-data'>
						No product transactions found.
					</div>
				)}
			</div>
		</div>
	);
};

export default ProductList;
