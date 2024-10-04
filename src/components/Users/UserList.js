/** @format */

import React, { useState } from 'react';
import './UserList.css'; // Importing CSS
import { deleteUserProfile } from '../../service/operations/userProfileApi';
import { useDispatch, useSelector } from 'react-redux';
import { refreshUser, removeUser } from '../../slices/userProfileSlice';
import Modal from '../Modal';
import AddUserModal from './AddUserModal';
import ViewUserModal from './ViewUserModal';
import EditUserModal from './EditUserModal';

const UserList = () => {
	const dispatch = useDispatch();
	const { token, user: loginUser } = useSelector((state) => state.auth);
	const { users } = useSelector((state) => state.userProfile);
	const { locations } = useSelector((state) => state.location);
	console.log('login User', loginUser);
	const [isAddOpen, setIsAddOpen] = useState(false);
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [isViewOpen, setIsViewOpen] = useState(false);
	const [activeUser, setActiveUser] = useState(null);

	const [searchTerm, setSearchTerm] = useState('');

	const filteredUsers = users.filter(
		(data) =>
			(data.profile?.firstName &&
				data.profile?.firstName
					.toLowerCase()
					.includes(searchTerm.toLowerCase())) ||
			(data.profile?.phone_number &&
				data.profile?.phone_number
					.toLowerCase()
					.includes(searchTerm.toLowerCase())) ||
			(data.user?.role &&
				data.user?.role.toLowerCase().includes(searchTerm.toLowerCase()))
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
	// const handleView = (user) => {
	// 	setActiveUser(user); // Set the active user to be viewed
	// 	setIsViewOpen(true);
	// };

	const handleDelete = async () => {
		try {
			const result = await deleteUserProfile(token, activeUser.user.id);
			if (result) {
				dispatch(removeUser(activeUser.user.id));
				dispatch(refreshUser());
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
		<div className='user-container'>
			<div className='user-search-container'>
				<input
					type='text'
					placeholder='Search User'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
				<button
					className='add-button3'
					onClick={() => handleAdd()}
				>
					ADD NEW USER
				</button>
			</div>

			<div className='users-table'>
				<div className='user-table-header'>
					<span>Customer Name</span>
					<span>Customer Email</span>
					<span>Role</span>
					<span>Location</span>
					<span>Phone Number</span>
					<span>Action</span>
				</div>

				{filteredUsers.length > 0 ? (
					filteredUsers.map((user) => {
						const preferredLocation = locations.find(
							(location) => location.id === user.profile?.preferred_location
						);
						return (
							<div
								key={user.user.id}
								className='user-table-row'
							>
								<span>
									{user.profile?.firstName} {user.profile?.lastName}
								</span>
								<span>{user.user.email}</span>
								<span>{user.user.role}</span>
								<span>
									{preferredLocation ? preferredLocation.name : 'N/A'}
								</span>
								<span>{user.profile?.phone_number}</span>
								<span>
									{/* <i
										className='fa fa-eye'
										onClick={() => handleView(user)}
									></i> */}
									<i
										className='fa fa-pencil'
										onClick={() => handleEdit(user)}
									></i>
									<i
										className={`fa fa-trash ${
											loginUser.id === user.user?.id ? 'disabled' : ''
										}`}
										onClick={
											loginUser.id !== user.user?.id
												? () => confirmDelete(user)
												: null
										}
										style={
											loginUser.id === user.user?.id
												? { cursor: 'not-allowed', opacity: 0.5 }
												: { cursor: 'pointer' }
										}
									></i>
								</span>
							</div>
						);
					})
				) : (
					<div className='no-data'>No users found.</div>
				)}
			</div>
			{isAddOpen && (
				<Modal
					setOpen={setIsAddOpen}
					open={isAddOpen}
				>
					<AddUserModal closeAddModal={closeAddModal} />
				</Modal>
			)}

			{isViewOpen && activeUser && (
				<Modal
					setOpen={setIsViewOpen}
					open={isViewOpen}
				>
					<ViewUserModal
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
					<DeleteUserModal
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
					<EditUserModal
						activeUser={activeUser}
						closeEditModal={closeEditModal}
					/>
				</Modal>
			)}
		</div>
	);
};

export default UserList;

function DeleteUserModal({ handleDelete, activeUser, closeDeleteModal }) {
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
