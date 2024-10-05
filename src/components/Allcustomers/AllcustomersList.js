/** @format */

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import './AllcustomersList.css'; // Importing CSS
import { saveAs } from 'file-saver'; // For saving files
import jsPDF from 'jspdf'; // For generating PDFs
import { formatDate } from '../../utils/formateDate';
import { FaFileCsv, FaFilePdf } from 'react-icons/fa'; // Icons for CSV and PDF

const CustomerList = ({
	customerReportData,
	selectedLocation,
	setSelectedLocation,
	dateRange,
	setDateRange,
	getCurrentMonthRange
}) => {
	const { customers } = useSelector((state) => state.customer);
	const { locations } = useSelector((state) => state.location);
	const [searchTerm, setSearchTerm] = useState('');

	// Set default start date as the 1st day of the current month and end date as today's date
	// const getCurrentMonthRange = () => {
	// 	const now = new Date();
	// 	const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 2);
	// 	const today = new Date();
	// 	return {
	// 		startDate: startOfMonth,
	// 		endDate: today,
	// 	};
	// };

	// const [dateRange, setDateRange] = useState(getCurrentMonthRange());
	// const [selectedLocation, setSelectedLocation] = useState('All');
	const [isCurrentMonth, setIsCurrentMonth] = useState(false);
	const uniqueLocations = [
		'All',
		...new Set(locations.map((location) => location.name)),
	];

	// Update dateRange when the checkbox is toggled for "Current Month"
	useEffect(() => {
		if (isCurrentMonth) {
			setDateRange(getCurrentMonthRange());
		}
	}, [isCurrentMonth]);

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

	const filteredCustomers = customers.filter((data) => {
		const isInMonth = !isCurrentMonth || isInCurrentMonth(data.user.created_at);

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

		return matchesSearchQuery && matchesLocation && isInMonth;
	});

	// Function to download CSV
	const handleDownloadCSV = () => {
		const headers = [
			'USER NAME',
			'LOCATION',
			'PHONE NUMBER',
			'MIN AVA',
			'TOTAL SPEND',
			'LAST PURCHASE',
		];

		// Generating the CSV content
		const csvRows = [
			headers.join(','), // header row
			...filteredCustomers.map((customer) => {
				const preferredLocation = locations.find(
					(location) => location.id === customer.profile?.preferred_location
				);
				const rowData = [
					`${customer.profile?.firstName || ''} ${
						customer.profile?.lastName || ''
					}`,
					preferredLocation ? preferredLocation.name : 'N/A',
					customer.profile?.phone_number || '',
					customer.profile?.available_balance || '0',
					customer.total_used_minutes || '0',
					formatDate(customer.profile?.updated_at) || 'N/A',
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
		const pageWidth = doc.internal.pageSize.width; // Get page width
		const pageHeight = doc.internal.pageSize.height; // Get page height
		const margin = 10; // Left and right margins
		const lineHeight = 10; // Adjust line height
		let row = 10; // Start y-position for the content

		// Adjust column positions for better spacing (adjusted widths to fit within the page)
		const columns = {
			userName: margin, // Start at the left margin
			location: margin + 35, // 35 units after the user name column
			phoneNumber: margin + 65, // 50 units after location
			minutesAvailable: margin + 95, // 50 units after phone number
			totalSpend: margin + 135, // 40 units after minutes available
			lastPurchase: margin + 165, // 40 units after total spend (adjust to fit the page)
		};

		// Title of the document
		doc.text('Customer List', margin, row);

		// Add headers for the table
		row += lineHeight;
		doc.setFont('helvetica', 'bold');
		doc.setFontSize(10);
		doc.text('Customer Name', columns.userName, row);
		doc.text('Location', columns.location, row);
		doc.text('Phone', columns.phoneNumber, row);
		doc.text('Minutes Avl', columns.minutesAvailable, row);
		doc.text('Tot Spend', columns.totalSpend, row);
		doc.text('Last Purchase', columns.lastPurchase, row); // Last Purchase header added

		// Move to the next row
		row += lineHeight;

		doc.setFont('helvetica', 'normal');
		filteredCustomers.forEach((customer) => {
			const preferredLocation = locations.find(
				(location) => location.id === customer.profile?.preferred_location
			);

			// Check if we need to add a new page
			if (row >= pageHeight - lineHeight) {
				doc.addPage(); // Add a new page
				row = margin; // Reset the row height for the new page

				// Re-add table headers to the new page
				doc.text('Customer Name', columns.userName, row);
				doc.text('Location', columns.location, row);
				doc.text('Phone', columns.phoneNumber, row);
				doc.text('Minutes Avl', columns.minutesAvailable, row);
				doc.text('Tot Spend', columns.totalSpend, row);
				doc.text('Last Purchase', columns.lastPurchase, row);

				row += lineHeight;
			}

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
				customer.profile?.phone_number || 'N/A',
				columns.phoneNumber,
				row
			);
			doc.text(
				`${customer.profile?.available_balance || '0'}`,
				columns.minutesAvailable,
				row
			);
			doc.text(
				`${customer.total_used_minutes || '0'}`,
				columns.totalSpend,
				row
			);
			doc.text(
				formatDate(customer.profile?.updated_at) || 'N/A',
				columns.lastPurchase,
				row
			); // Last purchase data added

			// Move to the next row
			row += lineHeight;
		});

		doc.save('Customers.pdf');
	};

	return (
		<div className='allcustomer-container'>
			<div className='filter-customer'>
				<div className='allcustomer-search-container'>
					<input
						type='text'
						placeholder='Search'
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
				<div className='allcustomer-location-select'>
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
				<div className='allcustomer-date-range-inputs'>
					<input
						type='date'
						name='startDate'
						value={dateRange.startDate?.toISOString().substring(0, 10)}
						placeholder='Start Date'
						onChange={handleDateRangeChange}
					/>
					<input
						type='date'
						name='endDate'
						value={dateRange.endDate?.toISOString().substring(0, 10)}
						placeholder='End Date'
						onChange={handleDateRangeChange}
					/>
				</div>

				<div className='allcustomer-files'>
					<div
						className='allcustomer-icon'
						onClick={handleDownloadCSV}
					>
						<FaFileCsv
							size={35}
							style={{ color: '#28a745' }}
						/>
					</div>
					<div
						className='allcustomer-icon'
						onClick={handleDownloadPDF}
					>
						<FaFilePdf
							size={35}
							style={{ color: '#dc3545' }}
						/>
					</div>
				</div>
			</div>

			<div className='allcustomer-table'>
				<div className='allcustomer-table-header'>
					<span>Customers Name</span>
					<span>Location</span>
					<span>Phone Number</span>
					<span>Min. Avail.</span>
					<span>Total Spent</span>
					<span>Register On</span>
				</div>

				{filteredCustomers.length > 0 ? (
					filteredCustomers.map((customer) => {
						const preferredLocation = locations.find(
							(location) => location.id === customer.profile?.preferred_location
						);
						return (
							<div
								key={customer.user.id}
								className='allcustomer-table-row'
							>
								<span data-label='Customer Name'>
									{customer.profile?.firstName} {customer.profile?.lastName}
								</span>
								<span data-label='Location'>
									{preferredLocation ? preferredLocation.name : 'N/A'}
								</span>
								<span data-label='Phone Number'>
									{customer.profile?.phone_number}
								</span>
								<span data-label='Min. Avail.' className='customerregtb'>
									{customer.profile?.available_balance}
								</span>
								<span data-label='Total Spent' className='customerregtb'>
									£{customer?.total_service_purchased_price?.toFixed(2)}
								</span>
								<span data-label='Register On'>
									{formatDate(customer.profile?.created_at)}
								</span>
							</div>
						);
					})
				) : (
					<div className='allcustomer-no-data'>No customers found.</div>
				)}
			</div>
		</div>
	);
};

export default CustomerList;
