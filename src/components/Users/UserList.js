/** @format */

import React, { useState } from 'react';
import './UserList.css'; // Importing CSS
import { deleteUserProfile } from '../../service/operations/userProfileApi';
import { useDispatch, useSelector } from 'react-redux';

const UserList = () => {
	const dispatch = useDispatch();
	const { token } = useSelector((state) => state.auth);
	const { users } = useSelector((state) => state.profile);
	const [isAddOpen, setIsAddOpen] = useState(false);
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [isViewOpen, setIsViewOpen] = useState(false);
	const [activeUser, setActiveUser] = useState(null);

	const [searchTerm, setSearchTerm] = useState('');

	const filteredUsers = users.filter((user) =>
		user.userName.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleCreateNewUser = () => {
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

	return (
		<div className='user-container'>
			<div className='user-search-container'>
				<input
					type='text'
					placeholder='Search User'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
				<button className='add-button3'>ADD NEW USER</button>
			</div>

			<div className='users-table'>
				<div className='user-table-header'>
					<span>USER NAME</span>
					<span>ROLE</span>
					<span>LOCATION</span>
					<span>PHONE NUMBER</span>
					<span>ACTION</span>
				</div>

				{filteredUsers.length > 0 ? (
					filteredUsers.map((user, index) => (
						<div
							key={index}
							className='user-table-row'
						>
							<span>{user.userName}</span>
							<span>{user.role}</span>
							<span>{user.location}</span>
							<span>{user.phoneNumber}</span>
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
					<div className='no-data'>No users found.</div>
				)}
			</div>
		</div>
	);
};

export default UserList;
