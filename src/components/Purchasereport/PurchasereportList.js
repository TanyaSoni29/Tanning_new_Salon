/** @format */

import React, { useState } from 'react';
import './PurchasereportList.css'; // Importing CSS
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
		<div className='purchasereportlist-container'>
			<div className='purchasereportlist-search-container'>
				<input
					type='text'
					placeholder='Search purchase'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
				<div className='purchasereportlist-buttons-container'>
					<button className='purchasereportlist-add-button4'>ADD NEW PURCHASE</button>
					<button className='purchasereportlist-download-button' onClick={handleDownloadCSV}>
						DOWNLOAD CSV
					</button>
					<button className='purchasereportlist-download-button' onClick={handleDownloadPDF}>
						DOWNLOAD PDF
					</button>
				</div>
			</div>

			<div className='purchasereportlist-table'>
				<div className='purchasereportlist-table-header'>
					<span>PRODUCT NAME</span>
					<span>PRICE</span>
					<span>LISTED ON</span>
					<span>ACTION</span>
				</div>

				{filteredProducts.length > 0 ? (
					filteredProducts.map((product, index) => (
						<div
							key={index}
							className='purchasereportlist-table-row'
						>
							<span>{product.productName}</span>
							<span>{product.price}</span>
							<span>{product.listedOn}</span>
							<span>
								<i className='fa fa-eye'></i>
								<i className='fa fa-pencil'></i>
								<i
									className='fa fa-trash'
									onClick={() => handleDelete(index)}
								></i>
							</span>
						</div>
					))
				) : (
					<div className='purchasereportlist-no-data'>No products found.</div>
				)}
			</div>
		</div>
	);
};

export default ProductList;
