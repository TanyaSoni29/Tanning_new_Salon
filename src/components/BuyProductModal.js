/** @format */

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import './BuyProductModal.css'; // Import the CSS file for styling

function BuyProductModal({ onClose, createProductTransactionOfUser }) {
	const { products } = useSelector((state) => state.product);
	const [selectedQuantities, setSelectedQuantities] = useState(
		products.map(() => 0)
	);

	// Handle quantity change from select dropdown
	const handleQuantityChange = (index, value) => {
		const updatedQuantities = [...selectedQuantities];
		updatedQuantities[index] = value;
		setSelectedQuantities(updatedQuantities);
	};

	// Handle the submit action
	const handleBuy = () => {
		products.forEach((product, index) => {
			const quantity = selectedQuantities[index];
			if (quantity > 0) {
				createProductTransactionOfUser(product.id, quantity);
			}
		});

		setSelectedQuantities(products.map(() => 0)); // Reset the quantities
		onClose(); // Close the modal after buying
	};
	return (
		<div className='Buyproduct-modal-container'>
			<h2 className='Buyproduct-modal-header'>Products</h2>
			<div className='Buyproducts-table'>
				<div className='Buyproducts-table-header'>
					<span>Product Name</span>
					<span>Price</span>
					<span>Quantity</span>
				</div>

				{/* Render products */}
				{products?.length > 0 ? (
					products.map((product, index) => (
						<div
							key={product?.id}
							className='Buyproducts-table-row'
						>
							<span className='Buyproduct-name'>
								{/* <img
									src={product?.image ? product?.image : ''}
									alt={product.name}
									className='Buyproduct-image'
								/> */}
								{product?.name}
							</span>
							<span>£{product?.price}</span>
							<span>
								<select
									value={selectedQuantities[index]}
									onChange={(e) =>
										handleQuantityChange(index, parseInt(e.target.value))
									}
									className='quantity-select'
								>
									{/* Options from 0 to 10 */}
									{[...Array(11).keys()].map((quantity) => (
										<option
											key={quantity}
											value={quantity}
										>
											{quantity}
										</option>
									))}
								</select>
							</span>
						</div>
					))
				) : (
					<div className='Buyproducts-table-row'>
						<span>No products found.</span>
					</div>
				)}

				<div className='modal-actions'>
					<button
						className='buy-button'
						onClick={handleBuy}
					>
						Buy
					</button>
					<button
						className='cancel-button'
						onClick={onClose}
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
}

export default BuyProductModal;
