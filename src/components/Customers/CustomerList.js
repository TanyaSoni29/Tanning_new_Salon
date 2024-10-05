/** @format */

import React, { useState } from 'react';
import './CustomerList.css'; // Importing CSS
import { useDispatch, useSelector } from 'react-redux';
import { refreshCustomers, removeCustomer } from '../../slices/customerProfile';
import { deleteUserProfile } from '../../service/operations/userProfileApi';
import { formatDate } from '../../utils/formateDate';
import Modal from '../Modal';
import AddCustomerModal from './AddCustomerModal';
import ViewCustomerModal from './ViewCustomerModal';
import EditCustomerModal from './EditCustomerModal';

const CustomerList = () => {
	const dispatch = useDispatch();
	const { token } = useSelector((state) => state.auth);
	const { customers } = useSelector((state) => state.customer);
	const { locations } = useSelector((state) => state.location);
	const [selectedLocation, setSelectedLocation] = useState('All');
	const [searchTerm, setSearchTerm] = useState('');

	const [isAddOpen, setIsAddOpen] = useState(false);
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [isWarningOpen, setIsWarningOpen] = useState(false); // Warning for remaining minutes
	const [activeUser, setActiveUser] = useState(null);
	const uniqueLocations = [
		'All',
		...new Set(locations.map((location) => location.name)),
	];
	const [isViewOpen, setIsViewOpen] = useState(false);

	const handleLocationChange = (e) => {
		setSelectedLocation(e.target.value);
	};

	const filteredCustomers = customers.filter((data) => {
		const firstName = data.profile?.firstName.toLowerCase() || '';
		const lastName = data?.profile?.lastName?.toLowerCase() || '';
		const phoneNumber = data.profile?.phone_number.toLowerCase() || '';

		const matchesSearchQuery =
			`${firstName} ${lastName}`.includes(searchTerm.toLowerCase()) ||
			phoneNumber.includes(searchTerm.toLowerCase());
		const preferredLocation = locations.find(
			(location) => location.id === data.profile?.preferred_location
		);
		const matchesLocation =
			selectedLocation === 'All' ||
			(preferredLocation && preferredLocation.name === selectedLocation);

		return matchesSearchQuery && matchesLocation;
	});

	const handleAdd = () => {
		setIsAddOpen(true);
	};

	// Handle opening the edit user modal
	const handleEdit = (user) => {
		setActiveUser(user); // Set the active user to be edited
		setIsEditOpen(true);
	};

	// Handle opening the view user modal
	const handleView = (user) => {
		setActiveUser(user); // Set the active user to be viewed
		setIsViewOpen(true);
	};

	// Actual delete function, only called in Delete Confirmation Modal or Warning Modal
	const handleDelete = async () => {
		try {
			const result = await deleteUserProfile(token, activeUser.user.id);
			if (result) {
				dispatch(removeCustomer(activeUser.user.id));
				dispatch(refreshCustomers());
				setIsDeleteOpen(false);
				setIsWarningOpen(false); // Close the warning if it was open
			}
		} catch (error) {
			console.error('Error during user deletion:', error);
		}
	};

	// Trigger when delete is requested
	const confirmDelete = (user) => {
		setActiveUser(user); // Set the active user to be deleted
		// Check if minutes are greater than 0
		if (user.profile.available_balance > 0) {
			setIsWarningOpen(true); // Show warning for remaining minutes
		} else {
			setIsDeleteOpen(true); // Proceed directly to deletion if minutes are 0
		}
	};

	// If the user proceeds after warning, directly delete the customer
	const closeDeleteModal = () => {
		setIsDeleteOpen(false);
		setActiveUser(null); // Reset active user
	};

	const closeWarningModal = () => {
		setIsWarningOpen(false);
		setActiveUser(null); // Reset active user
	};

	const closeEditModal = () => {
		setIsEditOpen(false);
		setActiveUser(null); // Reset active user
	};

	const closeAddModal = () => {
		setIsAddOpen(false);
	};

	const closeViewModal = () => {
		setIsViewOpen(false);
	};

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
				</div>

				<div className='add-button-wrapper'>
					<button
						className='add-button2'
						onClick={() => handleAdd()}
					>
						ADD NEW CUSTOMER
					</button>
				</div>
			</div>

			<div className='customers-table'>
				<div className='customer-table-header'>
					<span>Customers Name</span>
					<span>Location</span>
					<span>Phone</span>
					<span>Min. Aval.</span>
					<span>Total Spent</span>
					<span>Last Purchase</span>
					<span>Action</span>
				</div>

				{filteredCustomers.length > 0 ? (
					filteredCustomers.map((customer) => {
						const preferredLocation = locations.find(
							(location) =>
								location?.id === customer.profile?.preferred_location
						);
						return (
							<div
								key={customer.user.id}
								className='customer-table-row'
							>
								<span>
									{customer.profile?.firstName} {customer.profile?.lastName}
								</span>
								<span>{preferredLocation ? preferredLocation?.name : '-'}</span>
								<span>{customer.profile?.phone_number}</span>
								<span>{customer.profile?.available_balance}</span>
								<span>{customer.total_used_minutes?.toFixed(2)}</span>
								<span>{formatDate(customer.profile?.updated_at)}</span>
								<span>
									<i
										className='fa fa-eye'
										onClick={() => handleView(customer)}
									></i>
									<i
										className='fa fa-pencil'
										onClick={() => handleEdit(customer)}
									></i>
									<i
										className='fa fa-trash'
										onClick={() => confirmDelete(customer)}
									></i>
								</span>
							</div>
						);
					})
				) : (
					<div className='no-data'>No customers found.</div>
				)}
			</div>

			{isAddOpen && (
				<Modal
					setOpen={setIsAddOpen}
					open={isAddOpen}
				>
					<AddCustomerModal closeAddModal={closeAddModal} />
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

			{/* Delete Confirmation Modal */}
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

			{/* Additional Warning Modal */}
			{isWarningOpen && activeUser && (
				<Modal
					setOpen={setIsWarningOpen}
					open={isWarningOpen}
				>
					<RemainingMinutesWarningModal
						handleDelete={handleDelete} // Directly delete the customer from here
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
					/>
				</Modal>
			)}
		</div>
	);
};

export default CustomerList;

function DeleteCustomerModal({ handleDelete, activeUser, closeDeleteModal }) {
	return (
		<div className='delete-modal'>
			<p>Are you sure you want to delete {activeUser.user.name}?</p>
			<div className='button-container'>
				<button
					onClick={handleDelete}
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

// Additional warning modal for remaining minutes
function RemainingMinutesWarningModal({
	handleDelete,
	activeUser,
	closeWarningModal,
}) {
	return (
		<div className='warning-modal'>
			<p style={{ color: 'red' }}>
				{activeUser.user.name} has {activeUser.profile.available_balance}{' '}
				minutes remaining. Are you sure you want to delete this customer?
			</p>
			<div className='button-container'>
				{/* Directly call handleDelete here to delete */}
				<button
					onClick={handleDelete}
					className='confirm-button'
				>
					Proceed to Delete
				</button>
				<button
					className='cancel-button'
					onClick={closeWarningModal}
				>
					Cancel
				</button>
			</div>
		</div>
	);
}
