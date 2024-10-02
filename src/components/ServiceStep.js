/** @format */

// ServiceStep.js

import React, { useEffect, useState } from 'react';
import HeaderWithSidebar from './HeaderWithSidebar';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import './ServiceStep.css';
import Modal from '../components/Modal';
import BuyProductModal from './BuyProductModal';
import BuyServiceModal from './BuyServiceModal';
import UseServiceModal from './UseServiceModal';
import { refreshProduct } from '../slices/productSlice';
import { refreshService } from '../slices/serviceSlice';
import { createProductTransaction } from '../service/operations/productAndProductTransaction';
import {
	createServiceTransaction,
	getServiceUseOptions,
	getTotalSpend,
} from '../service/operations/serviceAndServiceTransaction';
import { refreshCustomers } from '../slices/customerProfile';

const ServiceStep = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [buyProductModal, setBuyProductModal] = useState(false);
	const [buyServiceModal, setBuyServiceModal] = useState(false);
	const [useServiceModal, setUseServiceModal] = useState(false);
	const { customer } = useSelector((state) => state.customer);
	const { token } = useSelector((state) => state.auth);
	const { locations } = useSelector((state) => state.location);
	const [combinedTransactions, setCombinedTransactions] = useState([]); // Access the selected customer
	const [serviceUseOptions, setServiceUseOptions] = useState([]);
	useEffect(() => {
		dispatch(refreshProduct());
		dispatch(refreshService());
		dispatch(refreshCustomers());
	}, [dispatch]);

	const createProductTransactionOfUser = async (productId, quantity) => {
		try {
			const data = {
				user_id: customer.user.id, // Assuming user data is stored in auth state
				location_id: customer.profile?.preferred_location, // Replace with the correct location ID
				product_id: productId,
				quantity,
			};
			await createProductTransaction(token, data);
			// const { productTransactions } = await getProductTransactionsByUser(token, selectedUser?._id);
			// setProductTransactions(productTransactions);
			// console.log("Transaction created", response.data);
		} catch (err) {
			console.error('Error creating transaction', err);
		}
	}; // Store selected quantities for each product

	const createServiceTransactionOfUser = async (serviceId) => {
		try {
			const data = {
				user_id: customer.user.id,
				service_id: serviceId, // Assuming user data is stored in auth state
				location_id: customer.profile?.preferred_location, // Replace with the correct location ID
				type: 'purchased',
			};
			await createServiceTransaction(token, data);
			dispatch(refreshCustomers());
		} catch (err) {
			console.error('Error creating transaction', err);
		}
	};

	const createServiceUseTransactionOfUser = async (serviceId) => {
		try {
			const data = {
				user_id: customer.user.id, // Assuming user data is stored in auth state
				location_id: customer.profile?.preferred_location,
				service_id: serviceId, // Replace with the correct location ID
				type: 'used',
			};
			await createServiceTransaction(token, data);
			await getTotalSpend(token, customer.user.id);
			dispatch(refreshCustomers());
		} catch (err) {
			console.error('Error creating transaction', err);
		}
	};

	const handleUseServiceModal = async () => {
		setUseServiceModal(true);
		try {
			const response = await getServiceUseOptions(token, customer.user.id);
			setServiceUseOptions(response);
		} catch (error) {
			console.log(error);
		}
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

	return (
		<>
			<HeaderWithSidebar />
			<div className='service-wizard-container'>
				<h2 className='heading'>Tanning Salon</h2>

				<div className='step-tabs'>
					{/* <button
						onClick={() => navigate('/locationStep')}
						className='tab'
					>
						LOCATION
					</button> */}
					<button
						className='tab'
						onClick={() => navigate('/about')}
					>
						ABOUT
					</button>
					<button className='tab active'>SERVICE</button>
				</div>

				{/* Display the selected customer information */}
				<div className='service-info'>
					{customer ? (
						<div>
							<p>
								<span>Name:</span> {customer.user.name}
							</p>
							<p>
								<span>Phone Number:</span> {customer.profile?.phone_number}
							</p>
							<p>
								<span>Gender:</span> {customer.profile?.gender}
							</p>
							<p>
								<span>Available Balance:</span>{' '}
								{customer.profile?.available_balance}
							</p>
							<p>
								<span>Total Spend:</span> {customer.profile?.total_spend}
							</p>
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
								>
									Use Service
								</button>
							)}
						</div>
					)}
				</div>
				<div className='location-container'>
					<div className='locations-table'>
						<div className='location-table-header'>
							<span>LOCATION NAME</span>
							<span>ADDRESS</span>
							<span>POSTCODE</span>
							<span>PHONE NUMBER</span>
							<span>ACTION</span>
						</div>

						{/* Render filtered locations */}
						{locations.length > 0 ? (
							locations.map((location) => (
								<div
									key={location.id}
									className='location-table-row'
								>
									<span>{location.name}</span>
									<span>{location.address}</span>
									<span>{location.post_code}</span>
									<span>{location.phone_number}</span>
								</div>
							))
						) : (
							<div className='location-table-row'>
								<span>No locations found.</span>
							</div>
						)}
					</div>
				</div>
				{buyProductModal && (
					<Modal
						open={buyProductModal}
						setOpen={setBuyProductModal}
					>
						<BuyProductModal
							onClose={closeBuyProductModal}
							createProductTransactionOfUser={createProductTransactionOfUser}
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
						/>
					</Modal>
				)}
			</div>
		</>
	);
};

export default ServiceStep;
