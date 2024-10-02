/** @format */

import React, { useState } from 'react';
import './CurrentmonthList.css'; // Importing CSS
import { saveAs } from 'file-saver'; // For saving files
import jsPDF from 'jspdf'; // For generating PDFs
import { FaFileCsv, FaFilePdf } from 'react-icons/fa'; // Icons for CSV and PDF

const ProductList = () => {
	const [products, setProducts] = useState([
		{
			productName: 'Product 1',
			price: '$100',
			listedOn: '2024-09-30',
		},
	]);

	const [searchTerm, setSearchTerm] = useState('');

	const filteredProducts = products.filter((product) =>
		product.productName.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleDelete = (index) => {
		const newProducts = [...products];
		newProducts.splice(index, 1);
		setProducts(newProducts);
	};

	// Function to download CSV
	const handleDownloadCSV = () => {
		const headers = ['Product Name', 'Price', 'Listed On'];
		const csvRows = [
			headers.join(','), // header row
			...products.map((product) =>
				[product.productName, product.price, product.listedOn].join(',')
			),
		].join('\n');

		const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
		saveAs(blob, 'products.csv');
	};

	// Function to download PDF
	const handleDownloadPDF = () => {
		const doc = new jsPDF();

		doc.text('Product List', 10, 10); // Title of the document
		let row = 20;

		// Table headers
		doc.text('Product Name', 10, row);
		doc.text('Price', 80, row);
		doc.text('Listed On', 140, row);
		row += 10;

		// Table content
		products.forEach((product) => {
			doc.text(product.productName, 10, row);
			doc.text(product.price, 80, row);
			doc.text(product.listedOn, 140, row);
			row += 10;
		});

		doc.save('products.pdf');
	};

	return (
		<div className='currentmonth-container'>
			<div className='currentmonth-search-container'>
				<input
					type='text'
					placeholder='Search currentmonth'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
				<div>
				<div className='currentmonth-files'>
					<div className='currentmonth-download' onClick={handleDownloadCSV}>
					<FaFileCsv size={45} style={{ color: '#28a745' }} /> {/* Green for CSV */}
				</div>
				<div className='currentmonth-download' onClick={handleDownloadPDF}>
					<FaFilePdf size={45} style={{ color: '#dc3545' }} /> {/* Red for PDF */}
				</div>
					</div>
				</div>
			</div>

			<div className='currentmonth-table'>
				<div className='currentmonth-table-header'>
					<span>PRODUCT NAME</span>
					<span>PRICE</span>
					<span>LISTED ON</span>
				</div>

				{filteredProducts.length > 0 ? (
					filteredProducts.map((product, index) => (
						<div
							key={index}
							className='currentmonth-table-row'
						>
							<span>{product.productName}</span>
							<span>{product.price}</span>
							<span>{product.listedOn}</span>
						</div>
					))
				) : (
					<div className='currentmonth-no-data'>No products found.</div>
				)}
			</div>
		</div>
	);
};

export default ProductList;
