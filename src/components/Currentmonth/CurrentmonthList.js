/** @format */

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import './CurrentmonthList.css'; // Importing CSS
import { saveAs } from 'file-saver'; // For saving files
import jsPDF from 'jspdf'; // For generating PDFs
import { formatDate } from '../../utils/formateDate';
import { FaFileCsv, FaFilePdf } from 'react-icons/fa'; // Icons for CSV and PDF

const CustomerList = () => {
	const { customers } = useSelector((state) => state.customer);
	const { locations } = useSelector((state) => state.location);
	const [searchTerm, setSearchTerm] = useState('');
	const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' }); // Sorting state

	// Get the first day of the current month and today's date
	const getCurrentMonthStartDate = () => {
		const now = new Date();
		return new Date(now.getFullYear(), now.getMonth(), 2); // First day of the current month
	};

	const getCurrentDate = () => {
		return new Date(); // Today's date
	};

	// Set default date range to current month start and today
	const [dateRange, setDateRange] = useState({
		startDate: getCurrentMonthStartDate(),
		endDate: getCurrentDate(),
	});

	// Update date inputs when component mounts
	useEffect(() => {
		setDateRange({
			startDate: getCurrentMonthStartDate(),
			endDate: getCurrentDate(),
		});
	}, []);

	const [selectedLocation, setSelectedLocation] = useState('All');
	const [isCurrentMonth, setIsCurrentMonth] = useState(false);
	const [isBySpend, setIsBySpend] = useState(false);
	const [isMinUsed, setIsMinUsed] = useState(false);
	const [isBySale, setIsBySale] = useState(false);

	const uniqueLocations = [
		'All',
		...new Set(locations.map((location) => location.name)),
	];

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

	const handleSort = (key) => {
		let direction = 'asc';
		if (sortConfig.key === key && sortConfig.direction === 'asc') {
			direction = 'desc';
		}
		setSortConfig({ key, direction });
	};

	const filteredCustomers = customers.filter((data) => {
		const CustomerDate = new Date(data.user.created_at);
		const isInDateRange =
			dateRange.startDate && dateRange.endDate
				? CustomerDate >= dateRange.startDate &&
				  CustomerDate <= dateRange.endDate
				: true;

		const firstName = data.profile?.firstName.toLowerCase() || '';
		const lastName = data?.profile?.lastName?.toLowerCase() || '';
		const phoneNumber = data.profile?.phone_number.toLowerCase() || '';

		const matchesSearchQuery =
			`${firstName} ${lastName}`.includes(searchTerm.toLowerCase()) ||
			phoneNumber.includes(searchTerm.toLowerCase());
		const preferredLocation = locations.find(
			(location) => location.id === data.profile?.preferred_location
		);
		const matchesLocation =
			selectedLocation === 'All' ||
			(preferredLocation && preferredLocation.name === selectedLocation);

		return isInDateRange && matchesSearchQuery && matchesLocation;
	});

	const sortedCustomers = filteredCustomers.sort((a, b) => {
		if (sortConfig.key) {
			const aValue = a.profile[sortConfig.key] || a[sortConfig.key] || '';
			const bValue = b.profile[sortConfig.key] || b[sortConfig.key] || '';

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

	// Function to download CSV
	// Function to download CSV
const handleDownloadCSV = () => {
    const headers = [
        'Customer Name', 'Location', 'Min Available', 
        'Total Min', 'Total Spent', 'Total Sales', 'Last Purchase'
    ];

    // Generating the CSV content
    const csvRows = [
        headers.join(','), // header row
        ...sortedCustomers.map((customer) => {
            const preferredLocation = locations.find(
                (location) => location.id === customer.profile?.preferred_location
            );
            const rowData = [
                `${customer.profile?.firstName || ''} ${customer.profile?.lastName || ''}`,
                preferredLocation ? preferredLocation.name : 'N/A',
                customer.profile?.available_balance || '0',
                customer.total_used_minutes || '0',
                `£${customer.total_service_purchased_price?.toFixed(2) || '0.00'}`,
                `£${customer.total_product_purchased_price?.toFixed(2) || '0.00'}`,
                formatDate(customer.profile?.updated_at) || 'N/A',
            ];
            return rowData.join(',');
        }),
    ].join('\n');

    // Adding BOM for proper UTF-8 encoding
    const csvContent = '\uFEFF' + csvRows; // BOM for UTF-8 encoding
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'Customers.csv');
};


	// Function to download PDF
	const handleDownloadPDF = () => {
		const doc = new jsPDF('p', 'pt', 'a4'); // Use A4 page size in points
		const pageWidth = doc.internal.pageSize.getWidth(); // Get page width
		const pageHeight = doc.internal.pageSize.getHeight(); // Get page height
		const margin = 40; // Set margin for the document
		const rowHeight = 20; // Set row height for table rows
		const cellPadding = 5; // Padding inside each cell
		let currentY = margin + 30; // Starting y-position for content

		// Define column widths and positions
		const colWidths = [120, 100, 100, 80, 80, 80, 80, 100]; // Widths for the columns

		// Set title
		doc.setFont('helvetica', 'bold');
		doc.setFontSize(18);
		doc.text('Customer Report', pageWidth / 2, margin, { align: 'center' });

		// Table headers
		const headers = [
			'Customer Name',
			'Location',
			'Min Available',
			'Total Min',
			'Total Spent',
			'Total Sales',
			'Last Purchase',
		];
		doc.setFontSize(12);
		doc.setFont('helvetica', 'bold');
		drawTableRow(doc, headers, currentY, colWidths);
		currentY += rowHeight;

		// Reset font for table data
		doc.setFont('helvetica', 'normal');

		// Loop through filtered transactions and add each row
		sortedCustomers.forEach((customer) => {
			const row = [
				`${customer.profile?.firstName || ''} ${
					customer.profile?.lastName || ''
				}`,
				locations.find(
					(location) => location.id === customer.profile?.preferred_location
				)?.name || 'N/A',
				`${customer.profile?.available_balance || '0'}`,
				`${customer.total_used_minutes || '0'}`,
				`£${customer.total_service_purchased_price?.toFixed(2)}`,
				`£${customer.total_product_purchased_price?.toFixed(2)}`,
				formatDate(customer.profile?.updated_at) || 'N/A',
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

		doc.save('Customers.pdf'); // Save the generated PDF
	};

	// Function to draw a single row with borders and centered text
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
			const textX = currentX + colWidth / 2 - textWidth / 2; // Center horizontally
			const textY = y + 15; // Center vertically within the cell
			doc.text(text, textX, textY); // Draw the text

			currentX += colWidth; // Move to the next column
		});
	};

	return (
		<div className='currentmon-container'>
			<div className='currentmon-filter-customer'>
				<div className='currentmon-search-container'>
					<input
						type='text'
						placeholder='Search'
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
				<div className='currentmon-location-select'>
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
				<div className='currentmon-date-range-inputs'>
					<input
						type='date'
						name='startDate'
						value={
							dateRange.startDate
								? dateRange.startDate.toISOString().split('T')[0]
								: ''
						}
						onChange={handleDateRangeChange}
					/>
					<input
						type='date'
						name='endDate'
						value={
							dateRange.endDate
								? dateRange.endDate.toISOString().split('T')[0]
								: ''
						}
						onChange={handleDateRangeChange}
					/>
				</div>
				<div className='currentmon-files'>
					<div
						className='currentmon-icon'
						onClick={handleDownloadCSV}
					>
						<FaFileCsv
							size={35}
							style={{ color: '#28a745' }}
						/>{' '}
					</div>
					<div
						className='currentmon-icon'
						onClick={handleDownloadPDF}
					>
						<FaFilePdf
							size={35}
							style={{ color: '#dc3545' }}
						/>{' '}
					</div>
				</div>
			</div>

			<div className='currentmon-table'>
				<div className='currentmon-table-header'>
					<span onClick={() => handleSort('firstName')}>
						Customers Name{' '}
						<i
							className={`fa fa-caret-${
								sortConfig.key === 'firstName' && sortConfig.direction === 'asc'
									? 'up'
									: 'down'
							}`}
						></i>
					</span>
					{/* <span onClick={() => handleSort('phone_number')}>
						Phone Number{' '}
						<i
							className={`fa fa-caret-${
								sortConfig.key === 'phone_number' &&
								sortConfig.direction === 'asc'
									? 'up'
									: 'down'
							}`}
						></i>
					</span> */}
					<span onClick={() => handleSort('preferred_location')}>
						Location{' '}
						<i
							className={`fa fa-caret-${
								sortConfig.key === 'preferred_location' &&
								sortConfig.direction === 'asc'
									? 'up'
									: 'down'
							}`}
						></i>
					</span>
					<span onClick={() => handleSort('available_balance')}>
						Min. Avail.{' '}
						<i
							className={`fa fa-caret-${
								sortConfig.key === 'available_balance' &&
								sortConfig.direction === 'asc'
									? 'up'
									: 'down'
							}`}
						></i>
					</span>
					<span onClick={() => handleSort('total_used_minutes')}>
						Total Min. Used{' '}
						<i
							className={`fa fa-caret-${
								sortConfig.key === 'total_used_minutes' &&
								sortConfig.direction === 'asc'
									? 'up'
									: 'down'
							}`}
						></i>
					</span>
					<span onClick={() => handleSort('total_service_purchased_price')}>
						Total Spent{' '}
						<i
							className={`fa fa-caret-${
								sortConfig.key === 'total_service_purchased_price' &&
								sortConfig.direction === 'asc'
									? 'up'
									: 'down'
							}`}
						></i>
					</span>
					<span onClick={() => handleSort('total_product_purchased_price')}>
						Total Sales{' '}
						<i
							className={`fa fa-caret-${
								sortConfig.key === 'total_product_purchased_price' &&
								sortConfig.direction === 'asc'
									? 'up'
									: 'down'
							}`}
						></i>
					</span>
				</div>

				{sortedCustomers.length > 0 ? (
					sortedCustomers.map((customer) => {
						const preferredLocation = locations.find(
							(location) => location.id === customer.profile?.preferred_location
						);
						return (
							<div
								key={customer.user.id}
								className='currentmon-table-row'
							>
								<span data-label='Customer Name'>
									{customer.profile?.firstName} {customer.profile?.lastName}
								</span>
								{/* <span data-label='Phone Number'>
									{customer.profile?.phone_number}
								</span> */}
								<span data-label='Location'>
									{preferredLocation ? preferredLocation.name : 'N/A'}
								</span>
								<span
									data-label='Min. Avail.'
									className='topcustomerMin'
								>
									{customer.profile?.available_balance}
								</span>
								<span
									data-label='Total Min. Used'
									className='topcustomerMin'
								>
									{customer.total_used_minutes?.toFixed(2)}
								</span>
								<span
									data-label='Total Spent'
									className='topcustomerspent'
								>
									£{customer.total_service_purchased_price?.toFixed(2)}
								</span>
								<span
									data-label='Total Sales'
									className='topcustomersell'
								>
									£{customer.total_product_purchased_price?.toFixed(2)}
								</span>
							</div>
						);
					})
				) : (
					<div className='currentmon-no-data'>No customers found.</div>
				)}
			</div>
		</div>
	);
};

export default CustomerList;
