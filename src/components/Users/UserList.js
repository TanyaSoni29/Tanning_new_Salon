/** @format */

import React, { useState } from 'react';
import './UserList.css'; // Importing CSS

const UserList = () => {
	const [users, setUsers] = useState([
		{
			userName: 'John Smith',
			role: 'Admin',
			location: 'New York',
			phoneNumber: '123-456-7890',
		},
	]);

	const [searchTerm, setSearchTerm] = useState('');

	const filteredUsers = users.filter((user) =>
		user.userName.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleDelete = (index) => {
		const newUsers = [...users];
		newUsers.splice(index, 1);
		setUsers(newUsers);
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
