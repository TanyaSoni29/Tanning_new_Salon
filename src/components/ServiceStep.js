/** @format */

import React, { useEffect, useState } from 'react';
import HeaderWithSidebar from './HeaderWithSidebar';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import './ServiceStep.css';
import Modal from '../components/Modal';
import BuyProductModal from './BuyProductModal';
import BuyServiceModal from './BuyServiceModal';
import UseServiceModal from './UseServiceModal';
import CreditModal from './CreditModal'; // Import the new CreditModal
import { refreshProduct } from '../slices/productSlice';
import { refreshService } from '../slices/serviceSlice';
import {
	createProductTransaction,
	getProductTransactionsByUser,
} from '../service/operations/productAndProductTransaction';
import {
	createServiceTransaction,
	getAllServices,
	getServiceTransactionsByUser,
	getTotalSpend,
} from '../service/operations/serviceAndServiceTransaction';
import { refreshSelectedCustomer } from '../slices/customerProfile';
import { formatDate } from '../utils/formateDate';

const ServiceStep = ({
	stats,
	selectedLocation,
	selectedLoginLocation,
	// dashboardSelectedCustomer,
}) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [buyProductModal, setBuyProductModal] = useState(false);
	const [buyServiceModal, setBuyServiceModal] = useState(false);
	const [useServiceModal, setUseServiceModal] = useState(false);
	const [creditModal, setCreditModal] = useState(false); // New state for CreditModal

	const { customer } = useSelector((state) => state.customer);
	const { locations } = useSelector((state) => state.location);
	const { users } = useSelector((state) => state.userProfile);
	const { token, user: loginUser } = useSelector((state) => state.auth);
	const [combinedTransactions, setCombinedTransactions] = useState([]);
	const [serviceUseOptions, setServiceUseOptions] = useState([]);

	const userDetails = users.find((user) => user.user.id === loginUser?.id);
	const preferredLocationId = userDetails?.profile?.preferred_location;
	console.log('customer in service Step', customer);
	useEffect(() => {
		dispatch(refreshSelectedCustomer(customer?.user?.id));
		dispatch(refreshProduct());
		dispatch(refreshService());
		refreshTransactionOfCustomer();
	}, [customer?.user?.id, dispatch]);

	// console.log('service step---', dashboardSelectedCustomer);

	useEffect(() => {
		if (!customer || !customer?.user?.id) {
			// console.log('No customer selected, redirecting...');
			navigate('/about'); // Redirect to the about page
			return;
		}
	}, [customer, navigate]);

	const createProductTransactionOfUser = async (productId, quantity) => {
		try {
			const data = {
				user_id: customer?.user?.id,
				location_id: selectedLoginLocation,
				product_id: productId,
				quantity,
			};
			await createProductTransaction(token, data);
			await refreshTransactionOfCustomer();
			dispatch(refreshSelectedCustomer(customer?.user?.id));
		} catch (err) {
			console.error('Error creating transaction', err);
		}
	};

	const createServiceTransactionOfUser = async (serviceId) => {
		try {
			const data = {
				user_id: customer?.user?.id,
				service_id: serviceId,
				location_id: selectedLoginLocation,
				type: 'purchased',
			};
			await createServiceTransaction(token, data);
			await refreshTransactionOfCustomer();
			dispatch(refreshSelectedCustomer(customer?.user?.id));
		} catch (err) {
			console.error('Error creating transaction', err);
		}
	};

	const createServiceUseTransactionOfUser = async (serviceId) => {
		try {
			const data = {
				user_id: customer?.user?.id,
				location_id: selectedLoginLocation,
				service_id: serviceId,
				type: 'used',
			};
			await createServiceTransaction(token, data);
			await getTotalSpend(token, customer?.user?.id);
			await refreshTransactionOfCustomer();
			dispatch(refreshSelectedCustomer(customer?.user?.id));
		} catch (err) {
			console.error('Error creating transaction', err);
		}
	};

	const createServiceCreditTransactionOfUser = async (quantity) => {
		try {
			const data = {
				user_id: customer?.user.id,
				location_id: selectedLoginLocation,
				quantity: quantity,
				type: 'credit',
			};
			await createServiceTransaction(token, data);
			await getTotalSpend(token, customer?.user.id);
			await refreshTransactionOfCustomer();
			dispatch(refreshSelectedCustomer(customer?.user?.id));
		} catch (err) {
			console.error('Error creating transaction', err);
		}
	};

	const refreshTransactionOfCustomer = async () => {
		if (!customer || !customer?.user?.id) {
			// console.log('No customer selected');
			return;
		}
		try {
			const [serviceResponse, productResponse] = await Promise.all([
				getServiceTransactionsByUser(token, customer?.user.id),
				getProductTransactionsByUser(token, customer?.user.id),
			]);
			const serviceData = Array.isArray(serviceResponse) ? serviceResponse : [];
			const productData = Array.isArray(productResponse) ? productResponse : [];
			const formattedServiceTransactions = serviceData.map((transaction) => ({
				id: transaction.transaction.id,
				productName: transaction?.service?.name,
				userName: `${transaction.user_details?.firstName} ${transaction.user_details?.lastName}`,
				quantity: transaction?.transaction?.quantity,
				price: Number(transaction?.service?.price),
				location: transaction.user_details?.preferred_location?.name,
				type:
					transaction.transaction?.type === 'used'
						? 'used'
						: transaction.transaction?.type === 'purchased'
						? 'purchased'
						: 'credit',
				createdAt: new Date(transaction.transaction?.created_at),
			}));

			const formattedProductTransactions = productData.map((transaction) => ({
				id: transaction?.id,
				productName: transaction?.product?.productName,
				userName: `${transaction.user?.firstName} ${transaction.user?.lastName}`,
				quantity: transaction?.quantity,
				price: Number(transaction?.product?.price),
				location: transaction?.location?.name,
				type: transaction?.product?.type
					? transaction?.product?.type
					: 'product',
				createdAt: new Date(transaction?.created_at),
			}));

			const combined = [
				...formattedServiceTransactions,
				...formattedProductTransactions,
			];

			setCombinedTransactions(
				combined.length > 0
					? combined.sort((a, b) => b.createdAt - a.createdAt)
					: []
			);
		} catch (error) {
			console.log('Error getting transactions', error);
			setCombinedTransactions([]);
		}
	};

	const handleUseServiceModal = async () => {
		setUseServiceModal(true);
		try {
			const response = await getAllServices(token, customer?.user.id);
			setServiceUseOptions(response);
		} catch (error) {
			console.log(error);
		}
	};

	// Function to toggle the CreditModal
	const handleCreditModal = () => {
		setCreditModal(true);
	};

	// Close function for CreditModal
	const closeCreditModal = () => {
		setCreditModal(false);
	};

	const closeBuyProductModal = () => {
		setBuyProductModal(false);
	};

	const closeBuyServiceModal = () => {
		setBuyServiceModal(false);
	};

	const closeUseServiceModal = () => {
		setUseServiceModal(false);
	};

	const preferredLocation = locations.find(
		(loc) => loc.id === customer?.profile?.preferred_location
	);

	return (
		<>
			<HeaderWithSidebar />
			<div className='service-wizard-container'>
				<div className='service-info'>
					{customer ? (
						<div
							style={{
								width: '50%',
								display: 'flex',
								flexDirection: 'row',
								justifyContent: 'space-between',
							}}
						>
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									padding: '10px',
								}}
							>
								<p>
									<span>Name:</span> {customer?.profile?.firstName}{' '}
									{customer?.profile?.lastName}
								</p>
								<p>
									<span>Phone Number:</span> {customer?.profile?.phone_number}
								</p>
								<p>
									<span>Gender:</span> {customer?.profile?.gender}
								</p>
								<p>
									<span>Registered Location:</span>{' '}
									{preferredLocation?.name ? preferredLocation?.name : 'N/A'}
								</p>
							</div>
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									padding: '10px',
								}}
							>
								<p>
									<span>Minutes Balance:</span>{' '}
									{customer?.profile?.available_balance}
								</p>
								<p>
									<span>Total Spent:</span> £
									{(
										(customer?.total_service_purchased_price || 0) +
										(customer?.total_product_purchased_price || 0)
									).toFixed(2)}
								</p>
							</div>
						</div>
					) : (
						<p>No customer selected</p>
					)}
					{customer && (
						<div className='use-btn'>
							<button
								className='confirm-button'
								onClick={() => setBuyProductModal(true)}
							>
								Buy Product
							</button>
							<button
								className='confirm-button'
								onClick={() => setBuyServiceModal(true)}
							>
								Buy Service
							</button>

							{customer?.profile?.available_balance > 0 && (
								<button
									className='confirm-button'
									onClick={handleUseServiceModal}
									disabled={customer?.profile?.available_balance <= 0}
								>
									Use Service
								</button>
							)}

							<button
								className='confirm-button'
								onClick={handleCreditModal} // New button for Credit Modal
							>
								Add Credit
							</button>
						</div>
					)}
				</div>
				<div className='transaction-container'>
					<div className='transaction-table'>
						<div className='transaction-table-header'>
							<span>Date/Time</span>
							<span>Type</span>
							<span>Product / Service</span>
							<span>Price</span>
							<span>Quantity</span>
						</div>
						<div className='transaction-table-wrapper'>
							{combinedTransactions.length > 0 ? (
								combinedTransactions.map((transaction) => (
									<div
										key={transaction.id}
										className='transaction-table-row'
									>
										<span data-label='Date/Time'>
											{transaction?.createdAt
												? `${formatDate(transaction?.createdAt)} ${new Date(
														transaction?.createdAt
												  ).toLocaleTimeString([], {
														hour: '2-digit',
														minute: '2-digit',
														second: '2-digit',
												  })}`
												: '-'}
										</span>
										<span data-label='Type'>
											<span
												className={`transaction-type ${transaction?.type}`}
												style={{
													backgroundColor:
														transaction?.type === 'product' &&
														transaction.productName.includes('SiennaX')
															? '#9B26B6' // Purple color for SiennaX products
															: '',
													color:
														transaction?.type === 'product' &&
														transaction.productName.includes('SiennaX')
															? '#fff' // White text color for contrast
															: '',
												}}
											>
												{transaction?.type
													? transaction?.type === 'used'
														? 'Used Min.'
														: transaction?.type === 'product'
														? 'Product'
														: transaction?.type === 'purchased'
														? 'Service'
														: 'Credit'
													: '-'}
											</span>
										</span>
										<span data-label='Product / Service'>
											{transaction.type === 'credit'
												? 'Credit Minutes'
												: transaction.productName
												? transaction?.productName
												: '-'}
										</span>
										<span
											data-label='Price'
											className='tbprice'
										>
											{typeof transaction?.price === 'number'
												? `£${transaction?.price.toFixed(2)}`
												: '-'}
										</span>
										<span
											data-label='Quantity'
											className='tbprice'
										>
											{transaction?.type === 'used' ||
											transaction?.type === 'purchased'
												? 1
												: transaction?.quantity}
										</span>
									</div>
								))
							) : (
								<div className='transaction-table-row'>
									<span>No transaction found.</span>
								</div>
							)}
						</div>
					</div>
				</div>
				{/* CreditModal */}
				{creditModal && (
					<Modal
						open={creditModal}
						setOpen={setCreditModal}
					>
						<CreditModal
							onClose={closeCreditModal}
							customer={customer}
							createServiceCreditTransactionOfUser={
								createServiceCreditTransactionOfUser
							}
						/>
					</Modal>
				)}

				{/* Other modals */}
				{buyProductModal && (
					<Modal
						open={buyProductModal}
						setOpen={setBuyProductModal}
					>
						<BuyProductModal
							onClose={closeBuyProductModal}
							createProductTransactionOfUser={createProductTransactionOfUser}
							selectedLoginLocation={selectedLoginLocation}
						/>
					</Modal>
				)}
				{buyServiceModal && (
					<Modal
						open={buyServiceModal}
						setOpen={setBuyServiceModal}
					>
						<BuyServiceModal
							createServiceTransactionOfUser={createServiceTransactionOfUser}
							onClose={closeBuyServiceModal}
						/>
					</Modal>
				)}
				{useServiceModal && (
					<Modal
						open={useServiceModal}
						setOpen={setUseServiceModal}
					>
						<UseServiceModal
							serviceUseOptions={serviceUseOptions}
							onClose={closeUseServiceModal}
							createServiceUseTransactionOfUser={
								createServiceUseTransactionOfUser
							}
							availableBalance={customer?.profile?.available_balance}
						/>
					</Modal>
				)}
			</div>
		</>
	);
};

export default ServiceStep;
