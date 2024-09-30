/** @format */

import React, { useState } from 'react';
import './ServiceList.css'; // Importing CSS

const ServiceList = () => {
	const [services, setServices] = useState([
		{ serviceName: '5 Min', price: 5, minutesAvailable: 5 },
		{ serviceName: '10 Min', price: 10, minutesAvailable: 10 },
		{ serviceName: '15 Min', price: 15, minutesAvailable: 15 },
	]);

	const [searchTerm, setSearchTerm] = useState('');

	const filteredServices = services.filter((service) =>
		service.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleDelete = (index) => {
		const newServices = [...services];
		newServices.splice(index, 1);
		setServices(newServices);
	};

	return (
		<div className='service-container'>
			<div className='search-container'>
				<input
					type='text'
					placeholder='Search Service'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
				<button className='add-button'>ADD NEW SERVICE</button>
			</div>

			<div className='services-table'>
				<div className='table-header'>
					<span>SERVICE NAME</span>
					<span>PRICE</span>
					<span>MINUTES AVAILABLE</span>
					<span>ACTION</span>
				</div>

				{filteredServices.length > 0 ? (
					filteredServices.map((service, index) => (
						<div
							key={index}
							className='table-row'
						>
							<span>{service.serviceName}</span>
							<span>{service.price}</span>
							<span>{service.minutesAvailable}</span>
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
					<div className='no-data'>No services found.</div>
				)}
			</div>
		</div>
	);
};

export default ServiceList;
