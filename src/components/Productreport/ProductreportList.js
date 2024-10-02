/** @format */

import React, { useState } from 'react';
import './ProductreportList.css'; // Importing CSS
import { saveAs } from 'file-saver'; // For saving files
import jsPDF from 'jspdf'; // For generating PDFs

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
		<div className='productreportlist-container'>
			<div className='productreportlist-search-container'>
				<input
					type='text'
					placeholder='Search productreportlist'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
				<div className='productreportlist-buttons-container'>
					<button className='productreportlist-download-button' onClick={handleDownloadCSV}>
						DOWNLOAD CSV
					</button>
					<button className='productreportlist-download-button' onClick={handleDownloadPDF}>
						DOWNLOAD PDF
					</button>
				</div>
			</div>

			<div className='productreportlist-table'>
				<div className='productreportlist-table-header'>
					<span>PRODUCT NAME</span>
					<span>PRICE</span>
					<span>LISTED ON</span>
				</div>

				{filteredProducts.length > 0 ? (
					filteredProducts.map((product, index) => (
						<div
							key={index}
							className='productreportlist-table-row'
						>
							<span>{product.productName}</span>
							<span>{product.price}</span>
							<span>{product.listedOn}</span>
						</div>
					))
				) : (
					<div className='productreportlist-no-data'>No products found.</div>
				)}
			</div>
		</div>
	);
};

export default ProductList;
