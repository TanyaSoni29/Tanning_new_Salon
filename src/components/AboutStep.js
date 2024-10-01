/** @format */

import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AboutStep.css'; // Ensure this CSS file is imported
import HeaderWithSidebar from './HeaderWithSidebar';
import { useSelector } from 'react-redux';
import CustomerOverview from './CustomerOverview';
import AddCustomerModal from './Customers/AddCustomerModal';
import Modal from '../components/Modal';
const AboutStep = () => {
	const navigate = useNavigate();
	const { customers } = useSelector((state) => state.customer);
	const { locationIndex } = useSelector((state) => state.location);
	const [isAddOpen, setIsAddOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const searchRef = useRef(null);
	const filteredCustomers = locationIndex
		? customers
				.filter((user) => user.profile !== null)
				.filter((data) => data.profile.preferred_location === locationIndex)
		: [];

	const handleKeyPress = (event) => {
		if (event.key === 'Enter') {
			searchRef.current.blur();
		}
	};
	const handleNext = () => {
		navigate('/service');
	};

	const handlePrevious = () => {
		navigate('/locationStep');
	};

	const closeAddModal = () => {
		setIsAddOpen(false);
	};

	return (
		<>
			<HeaderWithSidebar />
			<div className='wizard-container'>
				<h2 className='heading'>Tanning Salon</h2>
				<p className='subheading'>
					This information will let us know more about you.
				</p>

				<div className='step-tabs'>
					<button
						className='tab'
						onClick={() => navigate('/')}
					>
						LOCATION
					</button>
					<button className='tab active'>ABOUT</button>
					<button
						className='tab'
						onClick={() => navigate('/service')}
					>
						SERVICE
					</button>
				</div>

				<div className='about-info'>
					<h3 className='info-heading'>
						Let's start with the basic information
					</h3>
					<input
						type='text'
						className='search-input'
						value={searchQuery}
						onKeyPress={handleKeyPress}
						ref={searchRef}
						onFocus={(e) => e.target.select()}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder='Search Customer'
					/>

					<button className='search-button'>Search</button>
					<button
						className='register-button'
						onClick={() => setIsAddOpen(true)}
					>
						Register New Customer
					</button>
				</div>

				<div>
					<CustomerOverview
						filteredUsers={filteredCustomers}
						searchQuery={searchQuery}
					/>
				</div>

				<div className='navigation-buttons'>
					<button
						className='previous-button1'
						onClick={handlePrevious}
					>
						Previous
					</button>
					<button
						className='next-button'
						onClick={handleNext}
					>
						Next
					</button>
				</div>
				{isAddOpen && (
					<Modal
						setOpen={setIsAddOpen}
						open={isAddOpen}
					>
						<AddCustomerModal closeAddModal={closeAddModal} />
					</Modal>
				)}
			</div>
		</>
	);
};

export default AboutStep;
