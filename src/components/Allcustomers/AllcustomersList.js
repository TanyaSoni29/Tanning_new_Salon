import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import './AllcustomersList.css'; // Importing CSS
import { saveAs } from 'file-saver'; // For saving files
import jsPDF from 'jspdf'; // For generating PDFs
import { formatDate } from '../../utils/formateDate';
import { FaFileCsv, FaFilePdf } from 'react-icons/fa'; // Icons for CSV and PDF

const CustomerList = () => {
	const { customers } = useSelector((state) => state.customer);
	const { locations } = useSelector((state) => state.location);

	const [searchTerm, setSearchTerm] = useState('');

	const filteredCustomers = customers.filter(
		(data) =>
			(data.user.firstName &&
				data.user.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
			(data.profile?.phone_number &&
				data.profile?.phone_number
					.toLowerCase()
					.includes(searchTerm.toLowerCase()))
	);

	// Function to download CSV
	const handleDownloadCSV = () => {
		const headers = [
			'USER NAME',
			'LOCATION',
			'PHONE NUMBER',
			'MINUTES AVAILABLE',
			'TOTAL SPEND MINUTES',
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
					`${customer.profile?.firstName || ''} ${customer.profile?.lastName || ''}`,
					preferredLocation ? preferredLocation.name : 'N/A',
					customer.profile?.phone_number || '',
					customer.profile?.available_balance || '0',
					customer.profile?.total_spend || '0',
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
		let row = 20;

		doc.text('Customer List', 10, 10); // Title of the document

		// Table headers
		doc.setFontSize(10);
		doc.text('USER NAME', 10, row);
		doc.text('LOCATION', 50, row);
		doc.text('PHONE NUMBER', 90, row);
		doc.text('MINUTES AVAILABLE', 130, row);
		doc.text('TOTAL SPEND', 160, row);
		doc.text('LAST PURCHASE', 190, row);
		row += 10;

		// Table content
		filteredCustomers.forEach((customer) => {
			const preferredLocation = locations.find(
				(location) => location.id === customer.profile?.preferred_location
			);
			doc.text(
				`${customer.profile?.firstName || ''} ${customer.profile?.lastName || ''}`,
				10,
				row
			);
			doc.text(preferredLocation ? preferredLocation.name : 'N/A', 50, row);
			doc.text(customer.profile?.phone_number || 'N/A', 90, row);
			doc.text(`${customer.profile?.available_balance || '0'}`, 130, row);
			doc.text(`${customer.profile?.total_spend || '0'}`, 160, row);
			doc.text(formatDate(customer.profile?.updated_at) || 'N/A', 190, row);
			row += 10;
		});

		doc.save('Customers.pdf');
	};

	return (
		<div className='allcustomer-container'>
			<div className='allcustomer-search-container'>
				<input
					type='text'
					placeholder='Search Customer'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>

				<div class="files">
				<div className='allcustomer-icon' onClick={handleDownloadCSV}>
					<FaFileCsv size={45} style={{ color: '#28a745' }} /> {/* Green for CSV */}
					
				</div>
				<div className='allcustomer-icon' onClick={handleDownloadPDF}>
					<FaFilePdf size={45} style={{ color: '#dc3545' }} /> {/* Red for PDF */}	
				</div>
				</div>
			</div>

			

			<div className='allcustomer-table'>
				<div className='allcustomer-table-header'>
					<span>USER NAME</span>
					<span>LOCATION</span>
					<span>PHONE NUMBER</span>
					<span>MINUTES AVAILABLE</span>
					<span>TOTAL SPEND MINUTES</span>
					<span>LAST PURCHASE</span>
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
								<span>
									{customer.profile?.firstName} {customer.profile?.lastName}
								</span>
								<span>
									{preferredLocation ? preferredLocation.name : 'N/A'}
								</span>
								<span>{customer.profile?.phone_number}</span>
								<span>{customer.profile?.available_balance}</span>
								<span>{customer.profile?.total_spend}</span>
								<span>{formatDate(customer.profile?.updated_at)}</span>
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
