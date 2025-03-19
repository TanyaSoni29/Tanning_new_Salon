/** @format */

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import './CurrentmonthList.css'; // Importing CSS
import { saveAs } from 'file-saver'; // For saving files
import jsPDF from 'jspdf'; // For generating PDFs
import { formatDate } from '../../utils/formateDate';
import { FaFileCsv, FaFilePdf } from 'react-icons/fa'; // Icons for CSV and PDF
import { IoIosArrowBack } from 'react-icons/io';
import { IoIosArrowForward } from 'react-icons/io';
const CustomerList = () => {
	const { customers } = useSelector((state) => state.customer);
	const { locations } = useSelector((state) => state.location);
	const [searchTerm, setSearchTerm] = useState('');
	const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' }); // Sorting state
	const [currentPage, setCurrentPage] = useState(1);
	const customersPerPage = 10;
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

	useEffect(() => {
		setCurrentPage(1);
	}, [searchTerm, selectedLocation]);

	const filteredLocations = locations.filter((location) => location.isActive);

	const uniqueLocations = [
		'All',
		...new Set(filteredLocations.map((location) => location.name)),
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

	const isInCurrentMonth = (date) => {
		const now = new Date();
		const customerDate = new Date(date);
		return (
			now.getFullYear() === customerDate.getFullYear() &&
			now.getMonth() === customerDate.getMonth()
		);
	};

	const handleToggleChange = (toggle) => {
		if (toggle === 'spend') {
			setIsBySpend(!isBySpend);
			if (!isBySpend) {
				setIsMinUsed(false);
				setIsBySale(false);
			}
		} else if (toggle === 'minutes') {
			setIsMinUsed(!isMinUsed);
			if (!isMinUsed) {
				setIsBySpend(false);
				setIsBySale(false);
			}
		} else if (toggle === 'sales') {
			setIsBySale(!isBySale);
			if (!isBySale) {
				setIsBySpend(false);
				setIsMinUsed(false);
			}
		}
	};

	const handleSort = (key) => {
		let direction = 'asc';
		if (sortConfig.key === key && sortConfig.direction === 'asc') {
			direction = 'desc';
		}
		setSortConfig({ key, direction });
	};

	const filteredCustomers = customers.filter((data) => {
		const CustomerDate = new Date(data.profile.created_at);
		const isInDateRange =
			dateRange.startDate && dateRange.endDate
				? CustomerDate >= dateRange.startDate &&
				  CustomerDate <= dateRange.endDate
				: true;

		const isInMonth =
			!isCurrentMonth || isInCurrentMonth(data.profile.created_at);

		const firstName = data.profile?.firstName.toLowerCase() || '';
		const lastName = data?.profile?.lastName?.toLowerCase() || '';
		const phoneNumber = data.profile?.phone_number?.toLowerCase() || '';

		const matchesSearchQuery =
			`${firstName} ${lastName}`.includes(searchTerm.toLowerCase()) ||
			phoneNumber?.includes(searchTerm.toLowerCase());
		const preferredLocation = locations.find(
			(location) => location.id === data?.profile?.preferred_location
		);
		const matchesLocation =
			selectedLocation === 'All' ||
			(preferredLocation && preferredLocation.name === selectedLocation);

		return isInDateRange && matchesSearchQuery && matchesLocation && isInMonth;
	});

	const filteredAndSortedCustomers = filteredCustomers.sort((a, b) => {
		if (isBySpend) {
			return b.total_service_purchased_price - a.total_service_purchased_price;
		}
		if (isMinUsed) {
			return b.total_used_minutes - a.total_used_minutes;
		}
		if (isBySale) {
			return b.total_product_purchased_price - a.total_product_purchased_price;
		}

		// Default sorting based on user-selected column (ascending/descending)
		if (sortConfig.key) {
			const aValue = a.profile[sortConfig.key] || a[sortConfig.key] || 0;
			const bValue = b.profile[sortConfig.key] || b[sortConfig.key] || 0;
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

	const PaginationControls = () => (
		<div className='pagination-controls'>
			<button
				onClick={handlePrevPage}
				disabled={currentPage === 1}
			>
				<IoIosArrowBack fontSize={18} />
			</button>
			<button
				onClick={handleNextPage}
				disabled={currentPage === totalPages}
			>
				<IoIosArrowForward fontSize={18} />
			</button>
			<span>
				Page {currentPage} of {totalPages}
			</span>
		</div>
	);

	// Function to download CSV
	const handleDownloadCSV = () => {
		const headers = [
			'Customer Name',
			'Location',
			'Min. Avail.',
			'Total Min. Used',
			'Total Spent',
			'Total Sales',
			'Total',
		];

		// Generating the CSV content
		const csvRows = [
			headers.join(','), // header row
			...filteredAndSortedCustomers.map((customer) => {
				const preferredLocation = locations.find(
					(location) => location.id === customer.profile?.preferred_location
				);
				const total =
					(customer?.total_service_purchased_price || 0) +
					(customer?.total_product_purchased_price || 0);
				const rowData = [
					`${customer.profile?.firstName || ''} ${
						customer.profile?.lastName || ''
					}`,
					preferredLocation ? preferredLocation.name : 'N/A',
					customer.profile?.available_balance || '0',
					customer.total_used_minutes?.toFixed(2) || '0.00',
					`£${customer.total_service_purchased_price?.toFixed(2) || '0.00'}`,
					`£${customer.total_product_purchased_price?.toFixed(2) || '0.00'}`,
					`£${total.toFixed(2) || '0.00'}`,
				];
				return rowData.join(',');
			}),
		].join('\n');

		// Creating a Blob and saving it as CSV
		const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
		saveAs(blob, 'Customers.csv');
	};

	// Function to download PDF
	const handleDownloadPDF = () => {
		const doc = new jsPDF();
		const pageWidth = doc.internal.pageSize.getWidth(); // Get page width
		const pageHeight = doc.internal.pageSize.getHeight(); // Get page height
		const margin = 10; // Set margins
		const lineHeight = 10; // Adjust line height
		const rowHeight = 10; // Set row height for table rows
		let currentY = 20; // Start y-position for the content, slightly lower for the title

		// Center the title "Customer List"
		doc.setFont('helvetica', 'bold');
		doc.setFontSize(16);
		doc.text('Customer List', pageWidth / 2, currentY, { align: 'center' }); // Center the title
		currentY += lineHeight * 2; // Add space after the title

		// Define column widths for proper spacing
		const columnWidths = {
			userName: 40, // Width for the Customer Name column
			location: 25, // Width for the Location column
			minutesAvailable: 22, // Width for Min. Avail. column
			totalMinUsed: 25, // Width for Total Min. Used column
			totalSpend: 30, // Width for Total Spent column
			totalSales: 30, // Width for Total Sales column
			total: 25, // Width for Total column
		};

		// Adjust start positions for columns dynamically based on column widths
		const startX = margin;
		let colX = startX;

		// Draw table headers
		doc.setFont('helvetica', 'bold');
		doc.setFontSize(10);

		const headers = [
			{ title: 'Customer Name', width: columnWidths.userName },
			{ title: 'Location', width: columnWidths.location },
			{ title: 'Min. Avail.', width: columnWidths.minutesAvailable },
			{ title: 'Total Min.', width: columnWidths.totalMinUsed },
			{ title: 'Total Spent', width: columnWidths.totalSpend },
			{ title: 'Total Sales', width: columnWidths.totalSales },
			{ title: 'Total', width: columnWidths.total },
		];

		// Draw header cells with background and border
		headers.forEach((header) => {
			doc.rect(colX, currentY, header.width, rowHeight, 'S'); // Draw the cell border
			doc.text(header.title, colX + 2, currentY + 7); // Add text with some padding
			colX += header.width;
		});

		currentY += rowHeight; // Move to the next line for data rows
		doc.setFont('helvetica', 'normal');

		// Loop through filtered and sorted customers and add each row
		filteredAndSortedCustomers.forEach((customer) => {
			const preferredLocation = locations.find(
				(location) => location.id === customer.profile?.preferred_location
			);
			const total =
				(customer?.total_service_purchased_price || 0) +
				(customer?.total_product_purchased_price || 0);

			// Check if we need to add a new page
			if (currentY >= pageHeight - rowHeight * 2) {
				doc.addPage(); // Add a new page
				currentY = margin; // Reset the row height for the new page

				// Draw table headers on the new page
				colX = startX;
				headers.forEach((header) => {
					doc.rect(colX, currentY, header.width, rowHeight, 'S');
					doc.text(header.title, colX + 2, currentY + 7);
					colX += header.width;
				});
				currentY += rowHeight;
			}

			// Draw the data row
			colX = startX;
			const rowData = [
				`${customer.profile?.firstName || ''} ${
					customer.profile?.lastName || ''
				}`,
				preferredLocation ? preferredLocation.name : 'N/A',
				`${customer.profile?.available_balance || '0'}`,
				`${customer.total_used_minutes?.toFixed(2) || '0.00'}`,
				`£${customer.total_service_purchased_price?.toFixed(2) || '0.00'}`,
				`£${customer.total_product_purchased_price?.toFixed(2) || '0.00'}`,
				`£${total.toFixed(2) || '0.00'}`,
			];

			// Draw each cell in the row with borders
			rowData.forEach((data, index) => {
				const colWidth = headers[index].width;
				doc.rect(colX, currentY, colWidth, rowHeight, 'S'); // Draw the cell border
				doc.text(data, colX + 2, currentY + 7); // Add text with some padding
				colX += colWidth;
			});

			currentY += rowHeight; // Move to the next row
		});

		doc.save('Customers.pdf');
	};

	const indexOfLastCustomer = currentPage * customersPerPage;
	const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
	const currentCustomers = filteredAndSortedCustomers.slice(
		indexOfFirstCustomer,
		indexOfLastCustomer
	);
	const totalPages = Math.ceil(
		filteredAndSortedCustomers.length / customersPerPage
	);

	const handleNextPage = () => {
		if (currentPage < totalPages) setCurrentPage(currentPage + 1);
	};

	const handlePrevPage = () => {
		if (currentPage > 1) setCurrentPage(currentPage - 1);
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
				<div className='toggle-container'>
					<label className='switch'>
						<input
							type='checkbox'
							checked={isCurrentMonth}
							onChange={(e) => setIsCurrentMonth(e.target.checked)}
						/>
						<span className='slider round'></span>
					</label>
					<span>Current Month</span>
				</div>
				<div className='toggle-container'>
					<label className='switch'>
						<input
							type='checkbox'
							checked={isMinUsed}
							onChange={() => handleToggleChange('minutes')}
						/>
						<span className='slider round'></span>
					</label>
					<span>By Minutes Used</span>
				</div>
				<div className='toggle-container'>
					<label className='switch'>
						<input
							type='checkbox'
							checked={isBySpend}
							onChange={() => handleToggleChange('spend')}
						/>
						<span className='slider round'></span>
					</label>
					<span>By Spend</span>
				</div>
				<div className='toggle-container'>
					<label className='switch'>
						<input
							type='checkbox'
							checked={isBySale}
							onChange={() => handleToggleChange('sales')}
						/>
						<span className='slider round'></span>
					</label>
					<span>By Sales</span>
				</div>

				<div className='currentmon-files'>
					<div
						className='currentmon-icon'
						onClick={handleDownloadCSV}
					>
						<FaFileCsv
							size={40}
							style={{ color: '#28a745' }}
						/>{' '}
					</div>
					<div
						className='currentmon-icon'
						onClick={handleDownloadPDF}
					>
						<FaFilePdf
							size={40}
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
					{/* <span onClick={() => handleSort("phone_number")}>
            Phone Number{" "}
            <i
              className={`fa fa-caret-${
                sortConfig.key === "phone_number" &&
                sortConfig.direction === "asc"
                  ? "up"
                  : "down"
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
					<span onClick={() => handleSort('total')}>
						Total{' '}
						<i
							className={`fa fa-caret-${
								sortConfig.key === 'total' && sortConfig.direction === 'asc'
									? 'up'
									: 'down'
							}`}
						></i>
					</span>
				</div>

				{currentCustomers.length > 0 ? (
					currentCustomers.map((customer) => {
						const preferredLocation = locations.find(
							(location) =>
								location.id === customer?.profile?.preferred_location
						);
						const total =
							(customer?.total_service_purchased_price || 0) +
							(customer?.total_product_purchased_price || 0);
						return (
							<div
								key={customer.user.id}
								className='currentmon-table-row'
							>
								<span data-label='Customer Name'>
									{customer.profile?.firstName} {customer.profile?.lastName}
								</span>
								{/* <span data-label="Phone Number">
                  {customer.profile?.phone_number}
                </span> */}
								<span data-label='Location'>
									{preferredLocation ? preferredLocation.name : 'N/A'}
								</span>
								<span
									data-label='Min. Avail.'
									className='top-customer-num-align2'
								>
									{customer?.profile?.available_balance}
								</span>
								<span
									data-label='Total Min. Used'
									className='top-customer-num-align2'
								>
									{customer.total_used_minutes?.toFixed(2)}
								</span>
								<span
									data-label='Total Spent'
									className='top-customer-num-align'
								>
									£{customer.total_service_purchased_price?.toFixed(2)}
								</span>
								<span
									data-label='Total Sales'
									className='top-customer-num-align'
								>
									£{customer.total_product_purchased_price?.toFixed(2)}
								</span>
								<span
									data-label='Total'
									className='top-customer-num-align'
								>
									£{total?.toFixed(2)}
								</span>
							</div>
						);
					})
				) : (
					<div className='currentmon-no-data'>No customers found.</div>
				)}
			</div>
			{totalPages > 1 && <PaginationControls />}
		</div>
	);
};

export default CustomerList;
