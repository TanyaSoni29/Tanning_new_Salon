/** @format */

import React, { useEffect, useState } from 'react';
import './CustomerOverview.css'; // Importing the separate CSS file
import { useDispatch, useSelector } from 'react-redux';
import { formatDate } from '../utils/formateDate';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router';
import { setCustomer, setCustomerIndex } from '../slices/customerProfile';
import Modal from '../components/Modal';
import QuestionCustomer from './QuestionCustomer';
import {
	getAllServiceTransactions,
	getServiceTransactionsByUser,
} from '../service/operations/serviceAndServiceTransaction';
function CustomerOverview({ filteredCustomers }) {
	const [isQuesModal, setIsQuesModal] = useState(false);
	const dispatch = useDispatch();
	const { token } = useSelector((state) => state.auth);
	const [useServiceTransaction, setUseServiceTransaction] = useState([]);
	const handleSelectButton = (user) => {
		dispatch(setCustomer(user));
		setIsQuesModal(true);
	};

	const handleCloseQuesModal = () => {
		setIsQuesModal(false);
	};

	useEffect(() => {
		async function getServiceTransaction() {
			const response = await getAllServiceTransactions(token);
			setUseServiceTransaction(
				response.filter((data) => data.transaction?.type === 'used')
			);
		}
		getServiceTransaction();
	}, []);

	const getLastUsedServiceDate = (customerId) => {
		const userTransactions =
			useServiceTransaction?.length > 0 &&
			useServiceTransaction?.filter(
				(transaction) => transaction?.user_details?.id === customerId
			);
		if (userTransactions.length > 0) {
			// Sort transactions by date and return the most recent one
			const lastTransaction = userTransactions?.sort(
				(a, b) =>
					new Date(b.transaction?.created_at) -
					new Date(a.transaction?.created_at)
			)[0];
			return lastTransaction?.transaction?.created_at;
		}
		return null; // If no transactions found
	};

	// Filter customers based on the search query
	// const filterUsers = filteredUsers.filter(
	// 	(data) =>
	// 		(data?.user.role === 'customer' &&
	// 			((data?.profile?.firstName &&
	// 				data?.profile?.firstName
	// 					.toLowerCase()
	// 					.includes(searchQuery.toLowerCase())) ||
	// 				(data.profile?.phone_number &&
	// 					data.profile.phone_number
	// 						.toLowerCase()
	// 						.includes(searchQuery.toLowerCase())))) ||
	// 		(data.user?.email &&
	// 			data.user?.email.toLowerCase().includes(searchQuery.toLowerCase()))
	// );

	console.log('filterUsers in CustomerOverview---', filteredCustomers);

	return (
		<>
			<Modal
				setOpen={setIsQuesModal}
				open={isQuesModal}
			>
				<QuestionCustomer onClose={handleCloseQuesModal} />
			</Modal>

			<div className='customer-overview-container'>
				<div className='table-container'>
					<table className='customer-table'>
						<thead>
							<tr>
								<th> Customer Name</th>
								<th>Phone No.</th>
								<th>Minutes Balance</th>
								<th>Total Minutes Used</th>
								<th>Total Spent</th>
								<th>Last Used</th>
								<th>Select</th>
							</tr>
						</thead>
						<tbody>
							{filteredCustomers.length > 0 ? (
								filteredCustomers.map((data) => {
									const lastUsedDate = getLastUsedServiceDate(data.user?.id);
									return (
										<tr key={data.user?.id}>
											<td>{data.profile?.firstName}</td>
											<td>
												{data.profile?.phone_number
													? data.profile?.phone_number
													: '-'}
											</td>
											<td>{data.profile?.available_balance}</td>
											<td>{data?.total_used_minutes}</td>
											<td className='tdcustomer'>
												£{data?.total_service_purchased_price?.toFixed(2)}
											</td>
											<td>{lastUsedDate ? formatDate(lastUsedDate) : 'N/A'}</td>
											<td>
												<Button
													className='select-button'
													onClick={() => handleSelectButton(data)}
												>
													Select
												</Button>
											</td>
										</tr>
									);
								})
							) : (
								<tr>
									<td
										colSpan='5'
										className='no-customers'
									>
										No customers found.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</>
	);
}

export default CustomerOverview;
