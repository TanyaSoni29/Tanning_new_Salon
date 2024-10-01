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
	const [searchTerm, setSearchTerm] = useState('');

	const [isAddOpen, setIsAddOpen] = useState(false);
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [isViewOpen, setIsViewOpen] = useState(false);
	const [activeUser, setActiveUser] = useState(null);

	const filteredCustomers = customers.filter(
		(data) =>
			(data.user.firstName &&
				data.user.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
			(data.profile?.phone_number &&
				data.profile?.phone_number
					.toLowerCase()
					.includes(searchTerm.toLowerCase()))
	);

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

	const handleDelete = async () => {
		try {
			const result = await deleteUserProfile(token, activeUser.user.id);
			if (result) {
				dispatch(removeCustomer(activeUser.user.id));
				dispatch(refreshCustomers());
				setIsDeleteOpen(false);
			}
		} catch (error) {
			console.error('Error during user deletion:', error);
		} finally {
			setIsDeleteOpen(false);
		}
	};

	const confirmDelete = (user) => {
		setActiveUser(user); // Set the active user to be deleted
		setIsDeleteOpen(true); // Open delete confirmation modal
	};

	const closeDeleteModal = () => {
		setIsDeleteOpen(false);
		setActiveUser(null); // Reset active location
	};

	const closeEditModal = () => {
		setIsEditOpen(false);
		setActiveUser(null); // Reset active location
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
				<input
					type='text'
					placeholder='Search Customer'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
				<button
					className='add-button2'
					onClick={() => handleAdd()}
				>
					ADD NEW CUSTOMER
				</button>
			</div>

			<div className='customers-table'>
				<div className='customer-table-header'>
					<span>USER NAME</span>
					<span>LOCATION</span>
					<span>PHONE NUMBER</span>
					<span>MINUTES AVAILABLE</span>
					<span>TOTAL SPEND MINUTES</span>
					<span>LAST PURCHASE</span>
					<span>ACTION</span>
				</div>

				{filteredCustomers.length > 0 ? (
					filteredCustomers.map((customer) => {
						const preferredLocation = locations.find(
							(location) => location.id === customer.profile?.preferred_location
						);
						return (
							<div
								key={customer.user.id}
								className='customer-table-row'
							>
								<span>
									{customer.profile?.firstName} {customer.profile?.lastName}
								</span>
								<span>
									{preferredLocation ? preferredLocation.name : 'N/A'}
								</span>
								<span>{customer.profile?.phone_number}</span>
								<span>{customer.profile?.available_balance}</span>
								<span>{customer.profile?.total_spend}</span>
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
			{/* Delete Confirmation Modal/Alert */}
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
					onClick={() => handleDelete(activeUser.user.id)}
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
