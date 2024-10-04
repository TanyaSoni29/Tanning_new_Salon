/** @format */

import React, { useState, useMemo, useCallback } from 'react';
import './ProductreportList.css'; // Importing CSS
import { saveAs } from 'file-saver'; // For saving files
import jsPDF from 'jspdf'; // For generating PDFs
import { FaFileCsv, FaFilePdf } from 'react-icons/fa'; // Icons for CSV and PDF
import { useSelector } from 'react-redux';
import { formatDate } from '../../utils/formateDate';

const ProductList = ({ productTransaction }) => {
	// Helper function to format date for input fields (YYYY-MM-DD)
	const formatDateForInput = (date) => {
		return date.toISOString().slice(0, 10); // Return YYYY-MM-DD format
	};

	// Set the default date range: startDate as the 1st of the current month and endDate as today
	const getCurrentMonthRange = () => {
		const now = new Date();
		const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
		const today = new Date();
		return {
			startDate: startOfMonth,
			endDate: today,
		};
	};

	const [dateRange, setDateRange] = useState(getCurrentMonthRange());
	const [selectedLocation, setSelectedLocation] = useState('All');
	const [searchTerm, setSearchTerm] = useState('');

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

	const filteredTransaction = useMemo(() => {
		return productTransaction.filter((transaction) => {
			const transactionDate = new Date(transaction.last_transaction_date);
			const isInDateRange =
				dateRange.startDate && dateRange.endDate
					? transactionDate >= dateRange.startDate &&
					  transactionDate <= dateRange.endDate
					: true;

			const productName = transaction?.product?.name?.toLowerCase() || '';

			const matchesSearchQuery = productName.includes(searchTerm.toLowerCase());

			const matchesLocation =
				selectedLocation === 'All' ||
				transaction.location?.name === selectedLocation;

			return isInDateRange && matchesSearchQuery && matchesLocation;
		});
	}, [productTransaction, dateRange, searchTerm, selectedLocation]);

	const handleDownloadCSV = () => {
		const headers = [
			'Product Name',
			'Location',
			'Total Value',
			'Total Sold',
			'Last Sold On',
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
		doc.text('Last Sold On', columns.lastSoldOn, row);

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
				doc.text('Last Sold On', columns.lastSoldOn, row);
				row += lineHeight;
				doc.setFont('helvetica', 'normal');
			}

			// Add transaction data in the respective columns
			doc.text(transaction.product?.name, columns.productName, row);
			doc.text(transaction.location?.name || 'N/A', columns.location, row);
			doc.text(`£${transaction.total_price.toFixed(2)}`, columns.totalValue, row);
			doc.text(`${transaction.total_sold}`, columns.totalSold, row);
			doc.text(
				formatDate(transaction.last_transaction_date),
				columns.lastSoldOn,
				row
			);

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
							size={45}
							style={{ color: '#28a745' }}
						/>
					</div>
					<div
						className='productreportlist-download'
						onClick={handleDownloadPDF}
					>
						<FaFilePdf
							size={45}
							style={{ color: '#dc3545' }}
						/>
					</div>
				</div>
			</div>

			<div className='productreportlist-table'>
				<div className='productreportlist-table-header'>
					<span>Product Name</span>
					<span>Location</span>
					<span>Total Value</span>
					<span>Total Sold</span>
					<span>Last Sold On</span>
				</div>

				{filteredTransaction.length > 0 ? (
					filteredTransaction.map((transaction, i) => (
						<div
							key={i}
							className='productreportlist-table-row'
						>
							<span>{transaction.product.name}</span>
							<span>{transaction.location.name}</span>
							<span>£{transaction.total_price.toFixed(2)}</span>
							<span>{transaction.total_sold}</span>
							<span style={{ whiteSpace: 'nowrap' }}>
								{formatDate(transaction.last_transaction_date)}
							</span>
						</div>
					))
				) : (
					<div className='productreportlist-no-data'>
						No transactions found.
					</div>
				)}
			</div>
		</div>
	);
};

export default ProductList;
