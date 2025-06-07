/** @format */

import React, { useEffect, useState } from 'react';
import './UserList.css'; // Importing CSS
import { deleteUserProfile } from '../../service/operations/userProfileApi';
import { useDispatch, useSelector } from 'react-redux';
import { refreshUser, removeUser } from '../../slices/userProfileSlice';
import Modal from '../Modal';
import AddUserModal from './AddUserModal';
import EditUserModal from './EditUserModal';
// import { deleteAllData } from '../../service/operations/userApi';
import { setProducts } from '../../slices/productSlice';
import { setServices } from '../../slices/serviceSlice';
import { IoIosArrowBack } from 'react-icons/io';
import { IoIosArrowForward } from 'react-icons/io';

const UserList = () => {
	const dispatch = useDispatch();
	const { token, user: loginUser } = useSelector((state) => state.auth);
	const { users } = useSelector((state) => state.userProfile);
	const { locations } = useSelector((state) => state.location);
	const [isAddOpen, setIsAddOpen] = useState(false);
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [activeUser, setActiveUser] = useState(null);
	const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' }); // Sorting state
	const [isDeleteAllData, setIsDeleteAllData] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const usersPerPage = 10;
	// Function to handle sorting
	const sortedUsers = (users) => {
		if (!sortConfig.key) return users;

		return [...users].sort((a, b) => {
			const valA = getValue(a, sortConfig.key);
			const valB = getValue(b, sortConfig.key);

			if (valA < valB) {
				return sortConfig.direction === 'asc' ? -1 : 1;
			}
			if (valA > valB) {
				return sortConfig.direction === 'asc' ? 1 : -1;
			}
			return 0;
		});
	};

	useEffect(() => {
		setCurrentPage(1);
	}, [searchTerm]);

	// Helper function to access nested values for sorting
	const getValue = (user, key) => {
		switch (key) {
			case 'profile.firstName':
				return user.profile?.firstName?.toLowerCase() || '';
			case 'user.email':
				return user.user?.email?.toLowerCase() || '';
			case 'user.role':
				return user.user?.role?.toLowerCase() || '';
			case 'profile.preferred_location':
				return (
					locations
						.find(
							(location) => location.id === user.profile?.preferred_location
						)
						?.name?.toLowerCase() || ''
				);
			default:
				return '';
		}
	};

	// Filter users based on the search term
	const normalizedSearchTerm = searchTerm.toLowerCase().trim();

	const filteredUsers = sortedUsers(
		users.filter((data) => {
			// Combine first name and last name for easier full-name matching
			const fullName = `${data.profile?.firstName || ''} ${
				data.profile?.lastName || ''
			}`.toLowerCase();

			// Check for matches in full name, phone number, or role
			return (
				fullName.includes(normalizedSearchTerm) ||
				(data.profile?.phone_number &&
					data.profile.phone_number
						.toLowerCase()
						.includes(normalizedSearchTerm)) ||
				(data.user?.role &&
					data.user.role.toLowerCase().includes(normalizedSearchTerm))
			);
		})
	);

	const indexOfLastUser = currentPage * usersPerPage;
	const indexOfFirstUser = indexOfLastUser - usersPerPage;
	const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
	const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

	const handleNextPage = () => {
		if (currentPage < totalPages) setCurrentPage(currentPage + 1);
	};

	const handlePrevPage = () => {
		if (currentPage > 1) setCurrentPage(currentPage - 1);
	};

	const handleDeleteAll = () => setIsDeleteAllData(true);

	const handleAdd = () => setIsAddOpen(true);
	const handleEdit = (user) => {
		setActiveUser(user);
		setIsEditOpen(true);
	};

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

	// const handleDeleteAllData = async () => {
	// 	try {
	// 		const result = await deleteAllData(token);
	// 		if (result) {
	// 			dispatch(setProducts([]));
	// 			dispatch(setServices([]));
	// 			setIsDeleteAllData(false);
	// 		}
	// 	} catch (error) {
	// 		console.error('Error during all deletion:', error);
	// 	} finally {
	// 		setIsDeleteAllData(false);
	// 	}
	// };

	const confirmDelete = (user) => {
		setActiveUser(user);
		setIsDeleteOpen(true);
	};
	const closeDeleteAllData = () => setIsDeleteAllData(false);

	const closeDeleteModal = () => setIsDeleteOpen(false);
	const closeEditModal = () => setIsEditOpen(false);
	const closeAddModal = () => setIsAddOpen(false);

	// Sorting toggle
	const handleSort = (key) => {
		let direction = 'asc';
		if (sortConfig.key === key && sortConfig.direction === 'asc') {
			direction = 'desc';
		}
		setSortConfig({ key, direction });
	};

	// Function to display the correct icon for sorting
	const getSortIcon = (key) => {
		if (sortConfig.key === key) {
			return sortConfig.direction === 'asc' ? '▲' : '▼';
		}
		return '▲'; // Default icon
	};

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
		<div className='user-container'>
			<div className='user-search-container'>
				<input
					type='text'
					placeholder='Search User'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
				<div className='btn-add-delete'>
					<button
						className='add-button3'
						onClick={handleAdd}
					>
						Add New User
					</button>
					// <button
					// 	className='delete-button3'
					// 	onClick={handleDeleteAll}
					// >
					// 	Reset Customer Data
					// </button>
				</div>
			</div>

			<div className='users-table'>
				<div className='user-table-header'>
					<span>
						User Name
						<button
							className='sort-button'
							onClick={() => handleSort('profile.firstName')}
						>
							{getSortIcon('profile.firstName')}
						</button>
					</span>
					<span>
						User Email
						<button
							className='sort-button'
							onClick={() => handleSort('user.email')}
						>
							{getSortIcon('user.email')}
						</button>
					</span>
					<span>
						Role
						<button
							className='sort-button'
							onClick={() => handleSort('user.role')}
						>
							{getSortIcon('user.role')}
						</button>
					</span>
					<span>
						Location
						<button
							className='sort-button'
							onClick={() => handleSort('profile.preferred_location')}
						>
							{getSortIcon('profile.preferred_location')}
						</button>
					</span>
					<span>
						Phone Number
						<button
							className='sort-button'
							onClick={() => handleSort('profile.preferred_location')}
						>
							{getSortIcon('profile.preferred_location')}
						</button>
					</span>
					<span>Action</span>
				</div>

				{currentUsers.length > 0 ? (
					currentUsers.map((user) => {
						const preferredLocation = locations.find(
							(location) => location.id === user.profile?.preferred_location
						);
						return (
							<div
								key={user.user.id}
								className='user-table-row'
							>
								<span data-label='User Name'>
									{user.profile?.firstName} {user.profile?.lastName}
								</span>
								<span data-label='User Email'>{user.user.email}</span>
								<span data-label='Role'>{user.user.role}</span>
								<span data-label='Location'>
									{preferredLocation ? preferredLocation.name : 'N/A'}
								</span>
								<span data-label='Phone Number'>
									{user.profile?.phone_number}
								</span>
								<span data-label='Action'>
									<div className='actionusers'>
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
									</div>
								</span>
							</div>
						);
					})
				) : (
					<div className='no-data'>No users found.</div>
				)}
			</div>
			{totalPages > 1 && <PaginationControls />}
			{isAddOpen && (
				<Modal
					setOpen={setIsAddOpen}
					open={isAddOpen}
				>
					<AddUserModal closeAddModal={closeAddModal} />
				</Modal>
			)}

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

			{isDeleteAllData && (
				<Modal
					setOpen={setIsDeleteAllData}
					open={isDeleteAllData}
				>
					<DeleteAllModal
						handleDelete={handleDeleteAllData}
						closeDeleteAllData={closeDeleteAllData}
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
					className='cancel-button'
					onClick={closeDeleteModal}
				>
					Cancel
				</button>
				<button
					onClick={() => handleDelete(activeUser.user.id)}
					className='confirm-button'
				>
					Confirm
				</button>
			</div>
		</div>
	);
}

function DeleteAllModal({ handleDelete, closeDeleteAllData }) {
	return (
		<div className='delete-modal'>
			<p>
				Are you sure you want to delete all customers and their transactions?
			</p>
			<div className='button-container'>
				<button
					className='cancel-button'
					onClick={closeDeleteAllData}
				>
					Cancel
				</button>
				<button
					onClick={() => handleDelete()}
					className='confirm-button'
				>
					Confirm
				</button>
			</div>
		</div>
	);
}
