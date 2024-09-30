/** @format */

import React, { useState } from 'react';
import './CustomerList.css'; // Importing CSS

const CustomerList = () => {
	const [customers, setCustomers] = useState([
		{
			userName: 'John Doe',
			location: 'Location 1',
			phoneNumber: '123-456-7890',
			minutesAvailable: 120,
			totalSpendMinutes: 1000,
			lastServicePurchase: '2024-09-25',
		},
	]);

	const [searchTerm, setSearchTerm] = useState('');

	const filteredCustomers = customers.filter((customer) =>
		customer.userName.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleDelete = (index) => {
		const newCustomers = [...customers];
		newCustomers.splice(index, 1);
		setCustomers(newCustomers);
	};

	return (
		<div className='customer-container'>
			<div className='search-container'>
				<input
					type='text'
					placeholder='Search Customer'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
				<button className='add-button'>ADD NEW CUSTOMER</button>
			</div>

			<div className='customers-table'>
				<div className='table-header'>
					<span>USER NAME</span>
					<span>LOCATION</span>
					<span>PHONE NUMBER</span>
					<span>MINUTES AVAILABLE</span>
					<span>TOTAL SPEND MINUTES</span>
					<span>LAST SERVICE PURCHASE</span>
					<span>ACTION</span>
				</div>

				{filteredCustomers.length > 0 ? (
					filteredCustomers.map((customer, index) => (
						<div
							key={index}
							className='table-row'
						>
							<span>{customer.userName}</span>
							<span>{customer.location}</span>
							<span>{customer.phoneNumber}</span>
							<span>{customer.minutesAvailable}</span>
							<span>{customer.totalSpendMinutes}</span>
							<span>{customer.lastServicePurchase}</span>
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
					<div className='no-data'>No customers found.</div>
				)}
			</div>
		</div>
	);
};

export default CustomerList;
