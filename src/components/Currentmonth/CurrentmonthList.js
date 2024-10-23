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
		const CustomerDate = new Date(data.user.created_at);
		const isInDateRange =
			dateRange.startDate && dateRange.endDate
				? CustomerDate >= dateRange.startDate &&
				  CustomerDate <= dateRange.endDate
				: true;

		const isInMonth = !isCurrentMonth || isInCurrentMonth(data.user.created_at);

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

	const handleDownloadPDF = () => {
		const doc = new jsPDF();
		const pageWidth = doc.internal.pageSize.width; // Get page width
		const pageHeight = doc.internal.pageSize.height; // Get page height
		const margin = 10; // Left and right margins
		const lineHeight = 10; // Adjust line height
		let row = 20; // Start y-position for the content, slightly lower for the title

		// Center the title "Customer List"
		doc.setFont('helvetica', 'bold');
		doc.setFontSize(16);
		doc.text('Customer List', pageWidth / 2, row, { align: 'center' }); // Center title
		row += lineHeight * 2; // Add space after the title

		// Adjust column positions for proper spacing (with reduced widths)
		const columns = {
			userName: margin, // Start at the left margin
			location: margin + 50, // 50 units after the user name column
			minutesAvailable: margin + 100, // 50 units after location
			totalMinUsed: margin + 130, // 30 units after minutes available
			totalSpend: margin + 170, // 40 units after total min used
			totalSales: margin + 210,
			total: margin + 170, // 30 units after total spend
		};

		// Table Headers
		doc.setFont('helvetica', 'bold');
		doc.setFontSize(10);
		doc.text('Customer Name', columns.userName, row);
		doc.text('Location', columns.location, row);
		doc.text('Min. Avail.', columns.minutesAvailable, row);
		doc.text('Total Min. Used', columns.totalMinUsed, row);
		doc.text('Total Spent', columns.totalSpend, row);
		doc.text('Total Sales', columns.totalSales, row);
		doc.text('Total', columns.total, row);

		row += lineHeight;

		doc.setFont('helvetica', 'normal');

		filteredAndSortedCustomers.forEach((customer) => {
			const preferredLocation = locations.find(
				(location) => location.id === customer.profile?.preferred_location
			);
			const total =
				(customer?.total_service_purchased_price || 0) +
				(customer?.total_product_purchased_price || 0);

			// Check if we need to add a new page
			if (row >= pageHeight - lineHeight * 2) {
				doc.addPage(); // Add a new page
				row = margin; // Reset the row height for the new page

				// Re-add table headers to the new page
				doc.setFont('helvetica', 'bold');
				doc.text('Customer Name', columns.userName, row);
				doc.text('Location', columns.location, row);
				doc.text('Min. Avail.', columns.minutesAvailable, row);
				doc.text('Total Min. Used', columns.totalMinUsed, row);
				doc.text('Total Spent', columns.totalSpend, row);
				doc.text('Total Sales', columns.totalSales, row);
				doc.text('Total', columns.total, row);
				row += lineHeight;
				doc.setFont('helvetica', 'normal');
			}

			// Add a horizontal line after each row for a table-like structure
			doc.line(margin, row + 2, pageWidth - margin, row + 2);

			// Add the customer data
			doc.text(
				`${customer.profile?.firstName || ''} ${
					customer.profile?.lastName || ''
				}`,
				columns.userName,
				row
			);
			doc.text(
				preferredLocation ? preferredLocation.name : 'N/A',
				columns.location,
				row
			);
			doc.text(
				`${customer.profile?.available_balance || '0'}`,
				columns.minutesAvailable,
				row
			);
			doc.text(
				`${customer.total_used_minutes?.toFixed(2) || '0.00'}`,
				columns.totalMinUsed,
				row
			);
			doc.text(
				`£${customer.total_service_purchased_price?.toFixed(2) || '0.00'}`,
				columns.totalSpend,
				row,
				{ align: 'right' }
			);
			doc.text(`£${total.toFixed(2) || '0.00'}`, columns.total, row, {
				align: 'right',
			});

			row += lineHeight;
		});

		// Draw vertical lines to separate columns (for proper table borders)
		const lines = Object.values(columns);
		lines.forEach((linePosition) => {
			doc.line(linePosition - 2, 30, linePosition - 2, row); // Draw vertical lines from header to end of content
		});

		doc.save('Customers.pdf');
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

				{filteredAndSortedCustomers.length > 0 ? (
					filteredAndSortedCustomers.map((customer) => {
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
		</div>
	);
};

export default CustomerList;
