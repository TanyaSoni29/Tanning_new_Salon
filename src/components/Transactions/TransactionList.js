/** @format */

import React, { useState } from 'react';
import './TransactionList.css'; // Importing CSS

const TransactionList = () => {
	const [transactions, setTransactions] = useState([
		{
			userName: 'Customer 1 Customer',
			location: 'Location 1',
			productService: '15 Min',
			price: 15,
			quantity: 15,
			transactionType: 'PURCHASED',
			transactionTime: '28/09/2024 12:27:26',
		},
		{
			userName: 'Customer 1 Customer',
			location: 'Location 1',
			productService: '10 Min',
			price: 10,
			quantity: 10,
			transactionType: 'PURCHASED',
			transactionTime: '28/09/2024 10:08:48',
		},
		{
			userName: 'Customer 1 Customer',
			location: 'Location 1',
			productService: '15 Min',
			price: 15,
			quantity: 15,
			transactionType: 'USED',
			transactionTime: '28/09/2024 10:08:29',
		},
		{
			userName: 'Customer 1 Customer',
			location: 'Location 1',
			productService: '10 Min',
			price: 10,
			quantity: 10,
			transactionType: 'USED',
			transactionTime: '28/09/2024 10:08:14',
		},
		{
			userName: 'Customer 1 Customer',
			location: 'Location 1',
			productService: '5 Min',
			price: 5,
			quantity: 5,
			transactionType: 'USED',
			transactionTime: '28/09/2024 10:07:55',
		},
	]);

	const [searchStartDate, setSearchStartDate] = useState('');
	const [searchEndDate, setSearchEndDate] = useState('');

	const handleSearch = () => {
		// Here you would filter transactions based on the date range
		console.log(
			`Searching transactions from ${searchStartDate} to ${searchEndDate}`
		);
	};

	return (
		<div className='transaction-container'>
			<div className='search-container'>
				<input
					type='date'
					placeholder='Start Date'
					value={searchStartDate}
					onChange={(e) => setSearchStartDate(e.target.value)}
				/>
				<input
					type='date'
					placeholder='End Date'
					value={searchEndDate}
					onChange={(e) => setSearchEndDate(e.target.value)}
				/>
				<button
					className='search-button'
					onClick={handleSearch}
				>
					Search Transactions
				</button>
			</div>

			<div className='transactions-table'>
				<div className='table-header'>
					<span>USER NAME</span>
					<span>LOCATION</span>
					<span>PRODUCT / SERVICE</span>
					<span>PRICE</span>
					<span>QUANTITY / USED MINUTES</span>
					<span>TRANSACTION TYPE</span>
					<span>TRANSACTION TIME</span>
				</div>

				{transactions.length > 0 ? (
					transactions.map((transaction, index) => (
						<div
							key={index}
							className='table-row'
						>
							<span>{transaction.userName}</span>
							<span>{transaction.location}</span>
							<span>{transaction.productService}</span>
							<span>{transaction.price}</span>
							<span>{transaction.quantity}</span>
							<span>
								<span
									className={
										transaction.transactionType === 'PURCHASED'
											? 'transaction-success'
											: 'transaction-failure'
									}
								>
									{transaction.transactionType}
								</span>
							</span>
							<span>{transaction.transactionTime}</span>
						</div>
					))
				) : (
					<div className='no-data'>No transactions found.</div>
				)}
			</div>

			<div className='pagination'>
				<button>1</button>
				<button>2</button>
				<button>{`>`}</button>
			</div>
		</div>
	);
};

export default TransactionList;
