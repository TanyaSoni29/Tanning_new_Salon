/** @format */

import React, { useState, useMemo, useEffect } from 'react';
import './DailyUsesList.css'; // Importing CSS
import { saveAs } from 'file-saver'; // For saving files
import jsPDF from 'jspdf'; // For generating PDFs
import { FaFileCsv, FaFilePdf } from 'react-icons/fa'; // Icons for CSV and PDF
import { formatDate } from '../../utils/formateDate';
import { useSelector } from 'react-redux';
import { IoIosArrowBack } from 'react-icons/io';
import { IoIosArrowForward } from 'react-icons/io';
const DailyUsesList = ({
	dailyUseServiceTransaction = [], // Add a default value of an empty array to avoid null errors
	selectedLocation,
	setSelectedLocation,
	dateRange,
	setDateRange,
}) => {
	const [searchTerm, setSearchTerm] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const servicesPerPage = 10;
	// Default sort by 'date' in descending order
	const [sortConfig, setSortConfig] = useState({
		key: 'date',
		direction: 'desc',
	});

	// Helper function to format date for input fields (YYYY-MM-DD)
	const formatDateForInput = (date) => {
		if (date instanceof Date && !isNaN(date)) {
			return date.toISOString().slice(0, 10); // Return YYYY-MM-DD format
		}
		return '';
	};

	const { locations } = useSelector((state) => state.location);

	const filteredLocations = locations.filter((location) => location.isActive);

	// Extract unique locations for dropdown
	const uniqueLocations = [
		'All',
		...new Set(filteredLocations.map((location) => location.name)),
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

	// Handle sorting logic
	const handleSort = (key) => {
		let direction = 'asc';
		if (sortConfig.key === key && sortConfig.direction === 'asc') {
			direction = 'desc';
		}
		setSortConfig({ key, direction });
	};

	// Filter and sort transactions based on search term, date range, and location
	const filteredTransaction = useMemo(() => {
		let sortedData = dailyUseServiceTransaction.filter((transaction) => {
			// const serviceName = transaction?.serviceName?.toLowerCase() || '';
			// const matchesSearchQuery = serviceName?.includes(
			// 	searchTerm.toLowerCase()
			// );
			const matchesLocation =
				selectedLocation === 'All' ||
				transaction?.location === selectedLocation;

			// return matchesSearchQuery && matchesLocation;
			return matchesLocation;
		});

		// Sorting logic
		if (sortConfig.key) {
			sortedData = sortedData.sort((a, b) => {
				const aValue = a[sortConfig.key] || '';
				const bValue = b[sortConfig.key] || '';

				// Handle date sorting specifically
				if (sortConfig.key === 'date') {
					const dateA = new Date(aValue);
					const dateB = new Date(bValue);
					return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
				}

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
	}, [dailyUseServiceTransaction, searchTerm, selectedLocation, sortConfig]);

	useEffect(() => {
		setCurrentPage(1);
	}, [searchTerm, selectedLocation]);

	// Function to download CSV
	const handleDownloadCSV = () => {
		const headers = ['Date', 'Location', 'Customer Count'];
		const csvRows = [
			headers.join(','), // header row
			...filteredTransaction.map((data) =>
				[
					formatDate(data.date), // Date
					// data.serviceName, // Service Name
					data.location?.name || 'N/A', // Location
					data.userCount, // Total Usage
				].join(',')
			),
		].join('\n');

		const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
		saveAs(blob, 'service-DailyUsage.csv');
	};

	// Function to download PDF with better formatting
	const handleDownloadPDF = () => {
		const doc = new jsPDF('p', 'pt', 'a4'); // A4 size PDF in portrait mode
		const pageWidth = doc.internal.pageSize.width;
		const pageHeight = doc.internal.pageSize.height;
		const leftMargin = 20;
		const tableTop = 60;
		const rowHeight = 20;
		const colWidths = [100, 150, 100, 80];
		let currentY = tableTop;

		// Set title
		doc.setFont('helvetica', 'bold');
		doc.setFontSize(18);
		doc.text('Service Daily Used Report', pageWidth / 2, 40, {
			align: 'center',
		});

		// Table headers
		const headers = ['Date', 'Location', 'Customer Count'];
		doc.setFont('helvetica', 'bold');
		doc.setFontSize(12);
		drawTableRow(doc, headers, currentY, colWidths);
		currentY += rowHeight;

		// Draw rows
		doc.setFont('helvetica', 'normal');
		doc.setFontSize(10);

		filteredTransaction.forEach((transaction) => {
			const row = [
				formatDate(transaction.date),
				// transaction.serviceName,
				transaction.location?.name || 'N/A',
				`${transaction.userCount}`,
			];

			drawTableRow(doc, row, currentY, colWidths);
			currentY += rowHeight;

			// If we reach the bottom of the page, add a new page
			if (currentY > pageHeight - rowHeight * 2) {
				doc.addPage();
				currentY = tableTop;
				drawTableRow(doc, headers, currentY, colWidths);
				currentY += rowHeight;
			}
		});

		doc.save('service-daily-used.pdf');
	};

	// Function to draw a single row with borders
	const drawTableRow = (doc, rowData, y, colWidths) => {
		const startX = 20;
		let currentX = startX;

		rowData.forEach((data, index) => {
			doc.text(data, currentX + 5, y + 15);
			doc.rect(currentX, y, colWidths[index], 20);
			currentX += colWidths[index];
		});
	};

	const indexOfLastServices = currentPage * servicesPerPage;
	const indexOfFirstServices = indexOfLastServices - servicesPerPage;
	const currentServices = filteredTransaction.slice(
		indexOfFirstServices,
		indexOfLastServices
	);
	const totalPages = Math.ceil(filteredTransaction.length / servicesPerPage);

	const handleNextPage = () => {
		if (currentPage < totalPages) setCurrentPage(currentPage + 1);
	};

	const handlePrevPage = () => {
		if (currentPage > 1) setCurrentPage(currentPage - 1);
	};

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

	return (
		<div className='DailyUses-container'>
			<div className='filter-DailyUses'>
				{/* <div className='DailyUses-search-container'>
					<input
						type='text'
						placeholder='Search'
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div> */}
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
							<option
								key={location}
								value={location}
							>
								{location}
							</option>
						))}
					</select>
				</div>
				<div className='DailyUses-files'>
					<div
						className='DailyUses-download'
						onClick={handleDownloadCSV}
					>
						<FaFileCsv
							size={35}
							style={{ color: '#28a745' }}
						/>
					</div>
					<div
						className='DailyUses-download'
						onClick={handleDownloadPDF}
					>
						<FaFilePdf
							size={35}
							style={{ color: '#dc3545' }}
						/>
					</div>
				</div>
			</div>

			<div className='DailyUses-table'>
				<div className='DailyUses-table-header'>
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
					<span onClick={() => handleSort('customerCount')}>
						Customer Count{' '}
						<i
							className={`fa fa-caret-${
								sortConfig.key === 'customerCount' &&
								sortConfig.direction === 'asc'
									? 'up'
									: 'down'
							}`}
						></i>
					</span>
					{/* <span onClick={() => handleSort('total_quantity')}>
						Total Usage{' '}
						<i
							className={`fa fa-caret-${
								sortConfig.key === 'total_quantity' &&
								sortConfig.direction === 'asc'
									? 'up'
									: 'down'
							}`}
						></i>
					</span> */}
				</div>

				{currentServices.length > 0 ? (
					currentServices.map((transaction, i) => (
						<div
							key={i}
							className='DailyUses-table-row'
						>
							<span
								data-label='Date'
								style={{ whiteSpace: 'nowrap' }}
							>
								{formatDate(transaction?.date)}
							</span>
							{/* <span data-label='Service Name'>{transaction.serviceName}</span> */}
							<span data-label='Location'>
								{transaction?.location ? transaction?.location : '-'}
							</span>
							<span
								data-label='Customer Count'
								className='totalUse'
							>
								{transaction?.userCount}
							</span>
						</div>
					))
				) : (
					<div className='DailyUses-no-data'>No Data found.</div>
				)}
			</div>
			{totalPages > 1 && <PaginationControls />}
		</div>
	);
};

export default DailyUsesList;
