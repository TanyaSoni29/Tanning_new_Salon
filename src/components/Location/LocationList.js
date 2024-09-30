/** @format */

import React, { useState } from 'react';
import './LocationList.css'; // Importing CSS

const LocationList = () => {
	const [locations, setLocations] = useState([
		{ name: 'Location 1', address: 'location a', postcode: '212601' },
	]);

	const [searchTerm, setSearchTerm] = useState('');

	const filteredLocations = locations.filter((location) =>
		location.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleDelete = (index) => {
		const newLocations = [...locations];
		newLocations.splice(index, 1);
		setLocations(newLocations);
	};

	return (
		<div className='location-container'>
			<div className='search-container'>
				<input
					type='text'
					placeholder='Search Location'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
				<button className='add-button'>ADD NEW LOCATION</button>
			</div>

			<div className='locations-table'>
				<div className='table-header'>
					<span>LOCATION NAME</span>
					<span>ADDRESS</span>
					<span>POSTCODE</span>
					<span>ACTION</span>
				</div>

				{filteredLocations.map((location, index) => (
					<div
						key={index}
						className='table-row'
					>
						<span>{location.name}</span>
						<span>{location.address}</span>
						<span>{location.postcode}</span>
						<span>
							<i className='fa fa-eye'></i>
							<i className='fa fa-pencil'></i>
							<i
								className='fa fa-trash'
								onClick={() => handleDelete(index)}
							></i>
						</span>
					</div>
				))}
			</div>
		</div>
	);
};

export default LocationList;
