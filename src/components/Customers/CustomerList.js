/** @format */

import React, { useEffect, useState } from 'react';
import './CustomerList.css'; // Importing CSS
import { useDispatch, useSelector } from 'react-redux';
import {
	refreshSearchCustomers,
	removeCustomer,
	setSearchCustomers,
} from '../../slices/customerProfile';
import { deleteUserProfile } from '../../service/operations/userProfileApi';
import { formatDate } from '../../utils/formateDate';
import Modal from '../Modal';
import AddCustomerModal from './AddCustomerModal';
import ViewCustomerModal from './ViewCustomerModal';
import EditCustomerModal from './EditCustomerModal';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

const CustomerList = ({ selectedLoginLocation }) => {
	const dispatch = useDispatch();
	const { token, user: loginUser } = useSelector((state) => state.auth);
	const { searchCustomers } = useSelector((state) => state.customer);
	const { locations } = useSelector((state) => state.location);

	const [selectedLocation, setSelectedLocation] = useState('All');
	const [searchTerm, setSearchTerm] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const customersPerPage = 10;

	const [isAddOpen, setIsAddOpen] = useState(false);
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [isWarningOpen, setIsWarningOpen] = useState(false);
	const [activeUser, setActiveUser] = useState(null);

	const filteredLocations = locations?.filter((location) => location.isActive);
	const uniqueLocations = [
		'All',
		...new Set(filteredLocations.map((location) => location.name)),
	];

	const locationId =
		selectedLocation === 'All'
			? 0
			: locations.find((loc) => loc.name === selectedLocation)?.id;

	const [isViewOpen, setIsViewOpen] = useState(false);
	const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

	const handleLocationChange = (e) => {
		setSelectedLocation(e.target.value);
	};

	const handleSort = (key) => {
		let direction = 'asc';
		if (sortConfig.key === key && sortConfig.direction === 'asc') {
			direction = 'desc';
		}
		setSortConfig({ key, direction });
	};

	const normalizedSearchTerm = searchTerm.toLowerCase().trim();

	const filteredCustomers = searchCustomers.filter((data) => {
		const firstName = data?.profile?.firstName?.toLowerCase() || '';
		const lastName = data?.profile?.lastName?.toLowerCase() || '';
		const phoneNumber = data?.profile?.phone_number?.toLowerCase() || '';

		const fullName = `${firstName} ${lastName}`;
		const matchesSearchQuery =
			fullName.includes(normalizedSearchTerm) ||
			phoneNumber.includes(normalizedSearchTerm);

		const preferredLocation = locations.find(
			(location) => location.id === data.profile?.preferred_location
		);
		const matchesLocation =
			selectedLocation === 'All' ||
			preferredLocation?.name === selectedLocation;

		return matchesSearchQuery && matchesLocation;
	});

	const sortedCustomers = [...filteredCustomers].sort((a, b) => {
		if (sortConfig.key) {
			const aValue = a.profile[sortConfig.key] || a[sortConfig.key] || '';
			const bValue = b.profile[sortConfig.key] || b[sortConfig.key] || '';

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

	// Reset to the first page when searchTerm or selectedLocation changes
	useEffect(() => {
		setCurrentPage(1);
	}, [searchTerm, selectedLocation]);

	useEffect(() => {
		dispatch(setSearchCustomers([]));
	}, [dispatch]);

	const indexOfLastCustomer = currentPage * customersPerPage;
	const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
	const currentLocations = sortedCustomers.slice(
		indexOfFirstCustomer,
		indexOfLastCustomer
	);
	const totalPages = Math.ceil(sortedCustomers.length / customersPerPage);

	const handleNextPage = () => {
		if (currentPage < totalPages) setCurrentPage(currentPage + 1);
	};

	const handlePrevPage = () => {
		if (currentPage > 1) setCurrentPage(currentPage - 1);
	};

	const handleAdd = () => {
		setIsAddOpen(true);
	};

	const handleEdit = (user) => {
		setActiveUser(user);
		setIsEditOpen(true);
	};

	const handleView = (user) => {
		setActiveUser(user);
		setIsViewOpen(true);
	};

	const handleSearchButton = () => {
		const trimmedSearch = searchTerm.trim();
		if (
			trimmedSearch.length >= 3 ||
			trimmedSearch.length === 0 ||
			locationId !== undefined
		) {
			if (locationId === 0) {
				dispatch(refreshSearchCustomers(searchTerm));
			} else {
				dispatch(refreshSearchCustomers(searchTerm, locationId));
			}
		}
	};

	const handleDelete = async () => {
		try {
			const result = await deleteUserProfile(token, activeUser.user.id);
			if (result) {
				dispatch(removeCustomer(activeUser.user.id));
				if (locationId === 0) {
					dispatch(refreshSearchCustomers(searchTerm));
				} else {
					dispatch(refreshSearchCustomers(searchTerm, locationId));
				}
				setIsDeleteOpen(false);
				setIsWarningOpen(false);
			}
		} catch (error) {
			console.error('Error during user deletion:', error);
		}
	};

	const confirmDelete = (user) => {
		setActiveUser(user);
		if (user.profile.available_balance > 0) {
			setIsWarningOpen(true);
		} else {
			setIsDeleteOpen(true);
		}
	};

	const closeDeleteModal = () => {
		setIsDeleteOpen(false);
		setActiveUser(null);
	};

	const closeWarningModal = () => {
		setIsWarningOpen(false);
		setActiveUser(null);
	};

	const closeEditModal = () => {
		setIsEditOpen(false);
		setActiveUser(null);
	};

	const closeAddModal = () => {
		setIsAddOpen(false);
	};

	const closeViewModal = () => {
		setIsViewOpen(false);
	};

	const handleClearSearch = () => {
		setSearchTerm('');
		setSelectedLocation('All');
		dispatch(setSearchCustomers([]));
	};

	const isMobile = window.innerWidth <= 700;

	const PaginationControls = () => (
		<div className='pagination-controls'>
			<button
				onClick={handlePrevPage}
				disabled={currentPage === 1}
			>
				<IoIosArrowBack fontSize={18} />
			</button>
			<button
				onClick={handleNextPage}
				disabled={currentPage === totalPages}
			>
				<IoIosArrowForward fontSize={18} />
			</button>
			<span>
				Page {currentPage} of {totalPages}
			</span>
		</div>
	);

	return (
		<div className='customer-container'>
			<div className='customer-search-container'>
				<div className='search-location-wrapper'>
					<input
						type='text'
						placeholder='Search Customer'
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
					<div className='customer-location-select'>
						<select
							value={selectedLocation}
							onChange={handleLocationChange}
						>
							{uniqueLocations.map((location) => (
								<option
									key={location}
									value={location}
								>
									{location}
								</option>
							))}
						</select>
					</div>
					<button
						className='add-button2'
						onClick={handleSearchButton}
					>
						Search
					</button>
					<button
						className='add-button2'
						onClick={handleClearSearch}
					>
						Clear
					</button>
				</div>

				<div className='add-button-wrapper'>
					<button
						className='add-button2'
						onClick={() => handleAdd()}
					>
						Add New Customer
					</button>
				</div>
			</div>

			<div className='customers-table'>
				<div className='customer-table-header'>
					<span onClick={() => handleSort('firstName')}>Customers Name</span>
					<span onClick={() => handleSort('dob')}>D.O.B</span>
					<span onClick={() => handleSort('preferred_location')}>Location</span>
					<span onClick={() => handleSort('phone_number')}>Phone</span>
					<span onClick={() => handleSort('available_balance')}>
						Min. Aval.
					</span>
					<span onClick={() => handleSort('total_service_purchased_price')}>
						Total Spent
					</span>
					<span onClick={() => handleSort('updated_at')}>Last Purchase</span>
					<span>Action</span>
				</div>

				{currentLocations?.length > 0 ? (
					currentLocations.map((customer) => {
						const preferredLocation = locations?.find(
							(location) =>
								location?.id === customer.profile?.preferred_location
						);
						const formattedDOB = customer.profile?.dob
							? formatDate(customer.profile.dob)
							: '-';
						const totalSpent =
							(customer?.total_service_purchased_price || 0) +
							(customer?.total_product_purchased_price || 0);
						return (
							<div
								key={customer.user.id}
								className='customer-table-row'
							>
								<span data-label='Customer Name'>
									{customer.profile?.firstName} {customer.profile?.lastName}
								</span>
								<span data-label='DOB'>{formattedDOB}</span>
								<span data-label='Location'>
									{preferredLocation ? preferredLocation?.name : '-'}
								</span>
								<span data-label='Phone'>
									{customer.profile?.phone_number || '-'}
								</span>
								<span
									data-label='Min. Aval.'
									className='min-avail'
								>
									{customer.profile?.available_balance}
								</span>
								<span
									data-label='Total Spent'
									className='customertab'
								>
									£{totalSpent.toFixed(2)}
								</span>
								<span data-label='Last Purchase'>
									{formatDate(customer.profile?.updated_at)}
								</span>
								<span data-label='Action'>
									<div className='customerlistaction'>
										<i
											className='fa fa-eye'
											onClick={() => handleView(customer)}
										></i>
										<i
											className='fa fa-pencil'
											onClick={() => handleEdit(customer)}
										></i>
										{loginUser?.role === 'admin' && (
											<i
												className='fa fa-trash'
												onClick={() => confirmDelete(customer)}
											></i>
										)}
									</div>
								</span>
							</div>
						);
					})
				) : (
					<div className='no-data'>No customers found.</div>
				)}
			</div>
			{totalPages > 1 && <PaginationControls />}
			{isAddOpen && (
				<Modal
					setOpen={setIsAddOpen}
					open={isAddOpen}
				>
					<AddCustomerModal
						closeAddModal={closeAddModal}
						selectedLoginLocation={selectedLoginLocation}
						searchTerm={searchTerm}
						selectedLocation={locationId}
					/>
				</Modal>
			)}
			{isViewOpen && activeUser && (
				<Modal
					setOpen={setIsViewOpen}
					open={isViewOpen}
				>
					<ViewCustomerModal
						closeViewModal={closeViewModal}
						activeUser={activeUser}
					/>
				</Modal>
			)}
			{isDeleteOpen && activeUser && (
				<Modal
					setOpen={setIsDeleteOpen}
					open={isDeleteOpen}
				>
					<DeleteCustomerModal
						handleDelete={handleDelete}
						activeUser={activeUser}
						closeDeleteModal={closeDeleteModal}
					/>
				</Modal>
			)}
			{isWarningOpen && activeUser && (
				<Modal
					setOpen={setIsWarningOpen}
					open={isWarningOpen}
				>
					<RemainingMinutesWarningModal
						handleDelete={handleDelete}
						closeWarningModal={closeWarningModal}
						activeUser={activeUser}
					/>
				</Modal>
			)}
			{isEditOpen && activeUser && (
				<Modal
					setOpen={setIsEditOpen}
					open={isEditOpen}
				>
					<EditCustomerModal
						activeUser={activeUser}
						closeEditModal={closeEditModal}
						searchTerm={searchTerm}
						selectedLocation={locationId}
					/>
				</Modal>
			)}
		</div>
	);
};

export default CustomerList;

// DeleteCustomerModal Component
function DeleteCustomerModal({ handleDelete, activeUser, closeDeleteModal }) {
	return (
		<div className='delete-modal'>
			<p>Are you sure you want to delete {activeUser.user.name}?</p>
			<div className='button-container'>
				<button
					className='cancel-button'
					onClick={closeDeleteModal}
				>
					Cancel
				</button>
				<button
					onClick={handleDelete}
					className='confirm-button'
				>
					Confirm
				</button>
			</div>
		</div>
	);
}

// RemainingMinutesWarningModal Component
function RemainingMinutesWarningModal({
	handleDelete,
	activeUser,
	closeWarningModal,
}) {
	return (
		<div className='warning-modal'>
			<p style={{ color: 'yellow' }}>
				{activeUser.user.name} has {activeUser.profile.available_balance}{' '}
				minutes remaining. Are you sure you want to delete this customer?
			</p>
			<div className='button-container'>
				<button
					className='cancel-button'
					onClick={closeWarningModal}
				>
					Cancel
				</button>
				<button
					onClick={handleDelete}
					className='confirm-button'
				>
					Proceed to Delete
				</button>
			</div>
		</div>
	);
}
