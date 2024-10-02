import React, { useState } from 'react';
import './BydataList.css'; // Importing CSS
import { saveAs } from 'file-saver'; // For saving files
import jsPDF from 'jspdf'; // For generating PDFs
import { FaFileCsv, FaFilePdf } from 'react-icons/fa'; // Icons for CSV and PDF

const BydataList = () => {
	const [bydata, setBydata] = useState([
		{
			dataName: 'Data 1',
			price: '$100',
			listedOn: '2024-09-30',
		},
	]);

	const [searchTerm, setSearchTerm] = useState('');

	const filteredBydata = bydata.filter((data) =>
		data.dataName.toLowerCase().includes(searchTerm.toLowerCase())
	);

	// const handleDelete = (index) => {
	// 	const newBydata = [...bydata];
	// 	newBydata.splice(index, 1);
	// 	setBydata(newBydata);
	// };

	// Function to download CSV
	const handleDownloadCSV = () => {
		const headers = ['Data Name', 'Price', 'Listed On'];
		const csvRows = [
			headers.join(','), // header row
			...bydata.map((data) =>
				[data.dataName, data.price, data.listedOn].join(',')
			),
		].join('\n');

		const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
		saveAs(blob, 'bydata.csv');
	};

	// Function to download PDF
	const handleDownloadPDF = () => {
		const doc = new jsPDF();

		doc.text('Bydata List', 10, 10); // Title of the document
		let row = 20;

		// Table headers
		doc.text('Data Name', 10, row);
		doc.text('Price', 80, row);
		doc.text('Listed On', 140, row);
		row += 10;

		// Table content
		bydata.forEach((data) => {
			doc.text(data.dataName, 10, row);
			doc.text(data.price, 80, row);
			doc.text(data.listedOn, 140, row);
			row += 10;
		});

		doc.save('bydata.pdf');
	};

	return (
		<div className='bydata-container'>
			<div className='bydata-search-container'>
				<input
					type='text'
					placeholder='Search Data'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
				<div className='bydata-files'>
				<div className='bydata-download' onClick={handleDownloadCSV}>
					<FaFileCsv size={45} style={{ color: '#28a745' }} /> {/* Green for CSV */}
					
				</div>
				<div className='bydata-download' onClick={handleDownloadPDF}>
					<FaFilePdf size={45} style={{ color: '#dc3545' }} /> {/* Red for PDF */}
					
				</div>
				</div>

				
			</div>

			<div className='bydata-table'>
				<div className='bydata-table-header'>
					<span>DATA NAME</span>
					<span>PRICE</span>
					<span>LISTED ON</span>
				</div>

				{filteredBydata.length > 0 ? (
					filteredBydata.map((data, index) => (
						<div key={index} className='bydata-table-row'>
							<span>{data.dataName}</span>
							<span>{data.price}</span>
							<span>{data.listedOn}</span>
						</div>
					))
				) : (
					<div className='no-data'>No data found.</div>
				)}
			</div>
		</div>
	);
};

export default BydataList;
