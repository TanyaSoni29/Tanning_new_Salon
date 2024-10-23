/** @format */

import React, { useState } from 'react';
import './ProductList.css'; // Importing CSS
import { useDispatch, useSelector } from 'react-redux';
import { removeProduct, refreshProduct } from '../../slices/productSlice';
import { deleteProduct } from '../../service/operations/productAndProductTransaction';
import Modal from '../Modal';
import EditProductModal from './EditProductModal';
import AddProductModal from './AddProductModal';
import { formatDate } from '../../utils/formateDate';

const ProductList = () => {
	const dispatch = useDispatch();
	const { token, user: loginUser } = useSelector((state) => state.auth); // Assuming token is stored in auth slice
	const { products = [] } = useSelector((state) => state.product); // Ensure products is always an array, defaulting to []

	const [searchTerm, setSearchTerm] = useState('');
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [isEditOpen, setIsEditOpen] = useState(false); // Control delete modal/confirmation
	const [isAddOpen, setIsAddOpen] = useState(false);
	const [activeProduct, setActiveProduct] = useState(null); // Track the product to be deleted or edited
	// const { locations } = useSelector((state) => state.location);
	const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

	// const locationDetails = locations.find(
	// 	(location) => location.id === selectedLoginLocation
	// );

	// const stockField = `stock${locationDetails?.location_id}`;

	// Handle sorting logic
	const handleSort = (key) => {
		let direction = 'asc';
		if (sortConfig.key === key && sortConfig.direction === 'asc') {
			direction = 'desc';
		}
		setSortConfig({ key, direction });
	};

	console.log('Product', products);

	// Filter and sort products based on search term and sort configuration
	const filteredProducts = products
		?.filter((product) =>
			product?.name?.toLowerCase().includes(searchTerm.toLowerCase())
		)
		.sort((a, b) => {
			if (sortConfig.key) {
				const aValue = a[sortConfig.key] || a;
				const bValue = b[sortConfig.key] || b;

				if (aValue < bValue) {
					return sortConfig.direction === 'asc' ? -1 : 1;
				}
				if (aValue > bValue) {
					return sortConfig.direction === 'asc' ? 1 : -1;
				}
				return 0;
			}
			return 0;
		});

	// Function to handle the delete action with API call and Redux update
	const handleDelete = async (productId) => {
		try {
			// Call delete API
			const result = await deleteProduct(token, productId);

			// If deletion was successful, update the Redux state
			if (result) {
				dispatch(removeProduct(productId));
				dispatch(refreshProduct()); // Refresh products after deletion
				setIsDeleteOpen(false);
			}
		} catch (error) {
			console.error('Error during Product deletion:', error);
		} finally {
			setIsDeleteOpen(false); // Close delete modal/confirmation dialog
		}
	};

	const handleAdd = () => {
		setIsAddOpen(true);
	};

	const handleEdit = (product) => {
		setIsEditOpen(true);
		setActiveProduct(product); // Set the product to be edited
	};

	// Handle opening the delete confirmation/modal
	const confirmDelete = (product) => {
		setActiveProduct(product);
		setIsDeleteOpen(true); // Show delete confirmation modal
	};

	// Handle closing the delete confirmation/modal
	const closeDeleteModal = () => {
		setIsDeleteOpen(false);
		setActiveProduct(null); // Reset active Product
	};

	const closeEditModal = () => {
		setIsEditOpen(false);
		setActiveProduct(null); // Reset active Product
	};

	const closeAddModal = () => {
		setIsAddOpen(false);
	};

	return (
		<div className='products-container'>
			<div className='products-search-container'>
				<input
					type='text'
					placeholder='Search'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
				{loginUser?.role === 'admin' && (
					<button
						className='add-button1'
						onClick={handleAdd}
					>
						Add New Product
					</button>
				)}
			</div>

			<div className='product-table'>
				<div
					className={`${
						loginUser?.role === 'admin'
							? 'products-table-header'
							: 'products-table-header2'
					}`}
				>
					<span onClick={() => handleSort('name')}>
						Product Name{' '}
						<i
							className={`fa fa-caret-${
								sortConfig.key === 'name' && sortConfig.direction === 'asc'
									? 'up'
									: 'down'
							}`}
						></i>
					</span>
					<span onClick={() => handleSort('price')}>
						Price{' '}
						<i
							className={`fa fa-caret-${
								sortConfig.key === 'price' && sortConfig.direction === 'asc'
									? 'up'
									: 'down'
							}`}
						></i>
					</span>
					<span onClick={() => handleSort('stock')}>
						Stock01{' '}
						<i
							className={`fa fa-caret-${
								sortConfig.key === 'stock' && sortConfig.direction === 'asc'
									? 'up'
									: 'down'
							}`}
						></i>
					</span>
					<span onClick={() => handleSort('stock')}>
						Stock02{' '}
						<i
							className={`fa fa-caret-${
								sortConfig.key === 'stock' && sortConfig.direction === 'asc'
									? 'up'
									: 'down'
							}`}
						></i>
					</span>
					<span onClick={() => handleSort('stock')}>
						Stock03{' '}
						<i
							className={`fa fa-caret-${
								sortConfig.key === 'stock' && sortConfig.direction === 'asc'
									? 'up'
									: 'down'
							}`}
						></i>
					</span>
					<span onClick={() => handleSort('created_at')}>
						Listed On{' '}
						<i
							className={`fa fa-caret-${
								sortConfig.key === 'created_at' &&
								sortConfig.direction === 'asc'
									? 'up'
									: 'down'
							}`}
						></i>
					</span>
					{loginUser?.role === 'admin' && <span>Action</span>}
				</div>

				{/* Render filtered and sorted products */}
				{filteredProducts?.length > 0 ? (
					filteredProducts.map((product) => (
						<div
							key={product?.id}
							className={`${
								loginUser?.role === 'admin'
									? 'products-table-row'
									: 'products-table-row2'
							}`}
						>
							<span data-label='Product Name'>{product?.name}</span>
							<span
								data-label='Price'
								className='productPrice'
							>
								£{product?.price}
							</span>
							<span
								data-label='Stock'
								className='productPrice'
							>
								{product?.stock01 ?? '0'}
							</span>
							<span
								data-label='Stock'
								className='productPrice'
							>
								{product?.stock02 ?? '0'}
							</span>
							<span
								data-label='Stock'
								className='productPrice'
							>
								{product?.stock03 ?? '0'}
							</span>
							<span data-label='Listed On'>
								{formatDate(product?.created_at)}
							</span>
							{loginUser?.role === 'admin' && (
								<span
									data-label='Actions'
									className={`${loginUser?.role === 'admin' ? 'admin' : ''}`}
								>
									<div className='producaction'>
										<i
											className='fa fa-pencil'
											onClick={() => handleEdit(product)}
										></i>
										<i
											className='fa fa-trash'
											onClick={() => confirmDelete(product)} // Open delete modal
										></i>
									</div>
								</span>
							)}
						</div>
					))
				) : (
					<div className='products-table-row'>
						<span>No products found.</span>
					</div>
				)}
			</div>

			{isAddOpen && (
				<Modal
					setOpen={setIsAddOpen}
					open={isAddOpen}
				>
					<AddProductModal
						closeAddModal={closeAddModal}
						// selectedLoginLocation={selectedLoginLocation}
					/>
				</Modal>
			)}

			{/* Delete Confirmation Modal/Alert */}
			{isDeleteOpen && activeProduct && (
				<Modal
					setOpen={setIsDeleteOpen}
					open={isDeleteOpen}
				>
					<DeleteProductModal
						handleDelete={handleDelete}
						activeProduct={activeProduct}
						closeDeleteModal={closeDeleteModal}
					/>
				</Modal>
			)}

			{isEditOpen && activeProduct && (
				<Modal
					setOpen={setIsEditOpen}
					open={isEditOpen}
				>
					<EditProductModal
						activeProduct={activeProduct}
						closeEditModal={closeEditModal}
						// selectedLoginLocation={selectedLoginLocation}
					/>
				</Modal>
			)}
		</div>
	);
};

export default ProductList;

// DeleteProductModal Component
function DeleteProductModal({ handleDelete, activeProduct, closeDeleteModal }) {
	return (
		<div className='delete-modal'>
			<p>Are you sure you want to delete {activeProduct?.name}?</p>
			<div className='button-container'>
				<button
					onClick={() => handleDelete(activeProduct?.id)}
					className='confirm-button'
				>
					Confirm
				</button>
				<button
					className='cancel-button'
					onClick={closeDeleteModal}
				>
					Cancel
				</button>
			</div>
		</div>
	);
}
