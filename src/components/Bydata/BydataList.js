import React, { useState } from 'react';
import './BydataList.css'; // Importing CSS
import { saveAs } from 'file-saver'; // For saving files
import jsPDF from 'jspdf'; // For generating PDFs

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

	const handleDelete = (index) => {
		const newBydata = [...bydata];
		newBydata.splice(index, 1);
		setBydata(newBydata);
	};

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
				<div className='bydata-buttons-container'>
					<button className='bydata-add-button4'>ADD NEW DATA</button>
					{/* <button className='bydata-delete-button'>DELETE</button> */}
					<button className='bydata-download-button' onClick={handleDownloadCSV}>
						DOWNLOAD CSV
					</button>
					<button className='bydata-download-button' onClick={handleDownloadPDF}>
						DOWNLOAD PDF
					</button>
				</div>
			</div>

			<div className='bydata-table'>
				<div className='bydata-table-header'>
					<span>DATA NAME</span>
					<span>PRICE</span>
					<span>LISTED ON</span>
					<span>ACTION</span>
				</div>

				{filteredBydata.length > 0 ? (
					filteredBydata.map((data, index) => (
						<div key={index} className='bydata-table-row'>
							<span>{data.dataName}</span>
							<span>{data.price}</span>
							<span>{data.listedOn}</span>
							<span>
								<i className='fa fa-eye'></i>
								<i className='fa fa-pencil'></i>
								<i className='fa fa-trash' onClick={() => handleDelete(index)}></i>
							</span>
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