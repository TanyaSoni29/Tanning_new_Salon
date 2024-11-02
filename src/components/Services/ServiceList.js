/** @format */

import React, { useEffect, useState } from 'react';
import './ServiceList.css'; // Importing CSS
import { useDispatch, useSelector } from 'react-redux';
import { removeService, refreshService } from '../../slices/serviceSlice';
import { deleteService } from '../../service/operations/serviceAndServiceTransaction';
import Modal from '../Modal';
import EditServiceModal from './EditServicesModal';
import AddServiceModal from './AddServicesModal';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const ServiceList = () => {
	const dispatch = useDispatch();
	const { token, user: loginUser } = useSelector((state) => state.auth); 
	const { services = [] } = useSelector((state) => state.service); 

	const [searchTerm, setSearchTerm] = useState('');
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [isEditOpen, setIsEditOpen] = useState(false); 
	const [isAddOpen, setIsAddOpen] = useState(false);
	const [activeService, setActiveService] = useState(null); 
	const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' }); 
	const [currentPage, setCurrentPage] = useState(1);
	const servicesPerPage = 10;

	// Reset to the first page whenever searchTerm changes
	useEffect(() => {
		setCurrentPage(1);
	}, [searchTerm]);

	// Handle sorting logic
	const handleSort = (key) => {
		let direction = 'asc';
		if (sortConfig.key === key && sortConfig.direction === 'asc') {
			direction = 'desc';
		}
		setSortConfig({ key, direction });
	};

	// Filter and sort services based on search term and sort configuration
	const filteredServices = services
		?.filter((service) =>
			service?.serviceName?.toLowerCase().includes(searchTerm.toLowerCase())
		)
		.sort((a, b) => {
			if (sortConfig.key) {
				const aValue = a[sortConfig.key] || '';
				const bValue = b[sortConfig.key] || '';

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

	const indexOfLastServices = currentPage * servicesPerPage;
	const indexOfFirstServices = indexOfLastServices - servicesPerPage;
	const currentServices = filteredServices.slice(
		indexOfFirstServices,
		indexOfLastServices
	);
	const totalPages = Math.ceil(filteredServices.length / servicesPerPage);

	const handleNextPage = () => {
		if (currentPage < totalPages) setCurrentPage(currentPage + 1);
	};

	const handlePrevPage = () => {
		if (currentPage > 1) setCurrentPage(currentPage - 1);
	};

	const PaginationControls = () => (
		<div className='pagination-controls'>
			<button onClick={handlePrevPage} disabled={currentPage === 1}>
				<IoIosArrowBack fontSize={18} />
			</button>
			<button onClick={handleNextPage} disabled={currentPage === totalPages}>
				<IoIosArrowForward fontSize={18} />
			</button>
			<span>
				Page {currentPage} of {totalPages}
			</span>
		</div>
	);

	// Function to handle the delete action with API call and Redux update
	const handleDelete = async (serviceId) => {
		try {
			const result = await deleteService(token, serviceId);
			if (result) {
				dispatch(removeService(serviceId));
				dispatch(refreshService()); 
				setIsDeleteOpen(false);
			}
		} catch (error) {
			console.error('Error during Service deletion:', error);
		} finally {
			setIsDeleteOpen(false);
		}
	};

	const handleAdd = () => {
		setIsAddOpen(true);
	};

	const handleEdit = (service) => {
		setIsEditOpen(true);
		setActiveService(service); 
	};

	const confirmDelete = (service) => {
		setActiveService(service);
		setIsDeleteOpen(true); 
	};

	const closeDeleteModal = () => {
		setIsDeleteOpen(false);
		setActiveService(null); 
	};

	const closeEditModal = () => {
		setIsEditOpen(false);
		setActiveService(null); 
	};

	const closeAddModal = () => {
		setIsAddOpen(false);
	};

	return (
		<div className='service-container'>
			<div className='search-container'>
				<input
					type='text'
					placeholder='Search'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
				{loginUser?.role === 'admin' && (
					<button className='add-button' onClick={handleAdd}>
						Add New Service
					</button>
				)}
			</div>

			<div className='services-table'>
				<div className='table-header'>
					<span onClick={() => handleSort('serviceName')}>
						Service Name{' '}
						<i
							className={`fa fa-caret-${
								sortConfig.key === 'serviceName' &&
								sortConfig.direction === 'asc'
									? 'up'
									: 'down'
							}`}
						></i>
					</span>
					<span onClick={() => handleSort('minutesAvailable')}>
						Minutes{' '}
						<i
							className={`fa fa-caret-${
								sortConfig.key === 'minutesAvailable' &&
								sortConfig.direction === 'asc'
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
					{loginUser?.role === 'admin' && <span>Action</span>}
				</div>

				{currentServices?.length > 0 ? (
					currentServices.map((service) => (
						<div key={service?.id} className='table-row'>
							<span data-label='Service Name'>{service?.serviceName}</span>
							<span data-label='Minutes' className='servicetd'>
								{service?.minutesAvailable}
							</span>
							<span data-label='Price' className='servicepricetd'>
								£{service?.price}
							</span>
							{loginUser?.role === 'admin' && (
								<span data-label='Action'>
									<div className='servicelistaction'>
										<i
											className='fa fa-pencil'
											onClick={() => handleEdit(service)}
										></i>
										<i
											className='fa fa-trash'
											onClick={() => confirmDelete(service)}
										></i>
									</div>
								</span>
							)}
						</div>
					))
				) : (
					<div className='service-table-row'>
						<span>No services found.</span>
					</div>
				)}
			</div>
			{totalPages > 1 && <PaginationControls />}
			{isAddOpen && (
				<Modal setOpen={setIsAddOpen} open={isAddOpen}>
					<AddServiceModal closeAddModal={closeAddModal} />
				</Modal>
			)}

			{isDeleteOpen && activeService && (
				<Modal setOpen={setIsDeleteOpen} open={isDeleteOpen}>
					<DeleteServiceModal
						handleDelete={handleDelete}
						activeService={activeService}
						closeDeleteModal={closeDeleteModal}
					/>
				</Modal>
			)}

			{isEditOpen && activeService && (
				<Modal setOpen={setIsEditOpen} open={isEditOpen}>
					<EditServiceModal
						activeService={activeService}
						closeEditModal={closeEditModal}
					/>
				</Modal>
			)}
		</div>
	);
};

export default ServiceList;

// DeleteServiceModal Component
function DeleteServiceModal({ handleDelete, activeService, closeDeleteModal }) {
	return (
		<div className='delete-modal'>
			<p>Are you sure you want to delete {activeService?.serviceName}?</p>
			<div className='button-container'>
				<button className='cancel-button' onClick={closeDeleteModal}>
					Cancel
				</button>
				<button
					onClick={() => handleDelete(activeService?.id)}
					className='confirm-button'
				>
					Confirm
				</button>
			</div>
		</div>
	);
}
