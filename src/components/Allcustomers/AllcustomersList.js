/** @format */

import React, { useState } from 'react';
import './AllcustomersList.css'; // Importing CSS

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

	return (
		<div className='product-container'>
			<div className='product-search-container'>
				<input
					type='text'
					placeholder='Search Product'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
				<button className='add-button4'>ADD NEW PRODUCT</button>
			</div>

			<div className='products-table'>
				<div className='product-table-header'>
					<span>PRODUCT NAME</span>
					<span>PRICE</span>
					<span>LISTED ON</span>
					<span>ACTION</span>
				</div>

				{filteredProducts.length > 0 ? (
					filteredProducts.map((product, index) => (
						<div
							key={index}
							className='product-table-row'
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
					<div className='no-data'>No products found.</div>
				)}
			</div>
		</div>
	);
};

export default ProductList;
