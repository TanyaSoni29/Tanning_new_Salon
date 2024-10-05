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

	const handleDownloadCSV = () => {
		const headers = ['Product Name', 'Location', 'Total Value', 'Total Sold', 'Date'];
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
			productName: margin,
			location: margin + 180,
			totalValue: margin + 320,
			totalSold: margin + 440,
			lastSoldOn: margin + 520,
		};

		doc.setFontSize(12);
		doc.setFont('helvetica', 'bold');
		doc.text('Product Purchase Report', margin, margin); // Title at the top

		// Add table headers
		doc.setFontSize(10);
		doc.text('Product Name', columns.productName, row);
		doc.text('Location', columns.location, row);
		doc.text('Total Value', columns.totalValue, row);
		doc.text('Total Sold', columns.totalSold, row);
		doc.text('Date', columns.lastSoldOn, row);

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
				doc.text('Product Name', columns.productName, row);
				doc.text('Location', columns.location, row);
				doc.text('Total Value', columns.totalValue, row);
				doc.text('Total Sold', columns.totalSold, row);
				doc.text('Date', columns.lastSoldOn, row);
				row += lineHeight;
				doc.setFont('helvetica', 'normal');
			}

			// Add transaction data in the respective columns
			doc.text(transaction.product?.name, columns.productName, row);
			doc.text(transaction.location?.name || 'N/A', columns.location, row);
			doc.text(`£${transaction.total_price.toFixed(2)}`, columns.totalValue, row);
			doc.text(`${transaction.total_sold}`, columns.totalSold, row);
			doc.text(formatDate(transaction.last_transaction_date), columns.lastSoldOn, row);

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
					<select value={selectedLocation} onChange={handleLocationChange}>
						{uniqueLocations.map((location) => (
							<option key={location} value={location}>
								{location}
							</option>
						))}
					</select>
				</div>
				<div className='productreportlist-files'>
					<div className='productreportlist-download' onClick={handleDownloadCSV}>
						<FaFileCsv size={35} style={{ color: '#28a745' }} />
					</div>
					<div className='productreportlist-download' onClick={handleDownloadPDF}>
						<FaFilePdf size={35} style={{ color: '#dc3545' }} />
					</div>
				</div>
			</div>

			<div className='productreportlist-table'>
				<div className='productreportlist-table-header'>
					<span onClick={() => handleSort('last_transaction_date')}>
						Date{' '}
						<i className={`fa fa-caret-${sortConfig.key === 'last_transaction_date' && sortConfig.direction === 'asc' ? 'up' : 'down'}`}></i>
					</span>
					<span onClick={() => handleSort('name')}>
						Product Name{' '}
						<i className={`fa fa-caret-${sortConfig.key === 'name' && sortConfig.direction === 'asc' ? 'up' : 'down'}`}></i>
					</span>
					<span onClick={() => handleSort('location')}>
						Location{' '}
						<i className={`fa fa-caret-${sortConfig.key === 'location' && sortConfig.direction === 'asc' ? 'up' : 'down'}`}></i>
					</span>
					<span onClick={() => handleSort('total_price')}>
						Total Value{' '}
						<i className={`fa fa-caret-${sortConfig.key === 'total_price' && sortConfig.direction === 'asc' ? 'up' : 'down'}`}></i>
					</span>
					<span onClick={() => handleSort('total_sold')}>
						Total Sold{' '}
						<i className={`fa fa-caret-${sortConfig.key === 'total_sold' && sortConfig.direction === 'asc' ? 'up' : 'down'}`}></i>
					</span>
				</div>

				{filteredTransaction.length > 0 ? (
					filteredTransaction.map((transaction, i) => (
						<div key={i} className='productreportlist-table-row'>
							<span style={{ whiteSpace: 'nowrap' }} data-label="Date">
								{formatDate(transaction.last_transaction_date)}
							</span>
							<span data-label="Product Name">{transaction.product.name}</span>
							<span data-label="Location">{transaction.location.name}</span>
							<span data-label="Total Value">£{transaction.total_price.toFixed(2)}</span>
							<span data-label="Total Sold">{transaction.total_sold}</span>
						</div>
					))
				) : (
					<div className='productreportlist-no-data'>No transactions found.</div>
				)}
			</div>
		</div>
	);
};

export default ProductList;
