/** @format */

import React, { useState } from 'react';
import './LocationList.css'; // Importing CSS
import { useDispatch, useSelector } from 'react-redux';
import { removeLocation, refreshLocation } from '../../slices/locationSlice'; // Import removeLocation and refreshLocation actions
import { deleteLocation } from '../../service/operations/locationApi';
import Modal from '../Modal'; // Assuming deleteLocation API call
import EditLocationModal from './EditLocationModal';
import AddLocationModal from './AddLocationModal';

const LocationList = () => {
	const dispatch = useDispatch();
	const { token } = useSelector((state) => state.auth); // Assuming token is stored in auth slice
	const { locations } = useSelector((state) => state.location);
	const [searchTerm, setSearchTerm] = useState('');
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [isEditOpen, setIsEditOpen] = useState(false); // Control delete modal/confirmation
	const [isAddOpen, setIsAddOpen] = useState(false);
	const [activeLocation, setActiveLocation] = useState(null); // Track the location to be deleted
	const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

	// Sort locations based on the selected header (ascending/descending)
	const sortedLocations = [...locations].sort((a, b) => {
		if (sortConfig.key) {
			const valA = a[sortConfig.key]?.toLowerCase();
			const valB = b[sortConfig.key]?.toLowerCase();
			if (valA < valB) {
				return sortConfig.direction === 'asc' ? -1 : 1;
			}
			if (valA > valB) {
				return sortConfig.direction === 'asc' ? 1 : -1;
			}
			return 0;
		}
		return 0;
	});

	// Handle sort toggling between ascending and descending
	const handleSort = (key, direction) => {
		setSortConfig({ key, direction });
	};

	// Filter locations based on search term
	const filteredLocations = sortedLocations.filter(
		(location) =>
			(location?.name &&
				location?.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
			(location?.address &&
				location?.address?.toLowerCase().includes(searchTerm.toLowerCase())) ||
			(location?.phone_number &&
				location?.phone_number.toLowerCase().includes(searchTerm.toLowerCase()))
	);

	// Function to handle the delete action with API call and Redux update
	const handleDelete = async (locationId) => {
		try {
			// Call delete API
			const result = await deleteLocation(token, locationId);

			// If deletion was successful, update the Redux state
			if (result) {
				dispatch(removeLocation(locationId));
				dispatch(refreshLocation()); // Refresh locations after deletion
				setIsDeleteOpen(false);
			}
		} catch (error) {
			console.error('Error during location deletion:', error);
		} finally {
			setIsDeleteOpen(false); // Close delete modal/confirmation dialog
		}
	};

	const handleAdd = () => {
		setIsAddOpen(true);
	};

	const handleEdit = (location) => {
		setIsEditOpen(true);
		setActiveLocation(location); // Set the location to be edited
	};

	// Handle opening the delete confirmation/modal
	const confirmDelete = (location) => {
		setActiveLocation(location);
		setIsDeleteOpen(true); // Show delete confirmation modal
	};

	// Handle closing the delete confirmation/modal
	const closeDeleteModal = () => {
		setIsDeleteOpen(false);
		setActiveLocation(null); // Reset active location
	};

	const closeEditModal = () => {
		setIsEditOpen(false);
		setActiveLocation(null); // Reset active location
	};

	const closeAddModal = () => {
		setIsAddOpen(false);
	};

	return (
		<div className='location-container'>
			<div className='location-search-container'>
				<input
					type='text'
					placeholder='Search Location'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
				<button className='add-button1' onClick={() => handleAdd()}>
					ADD NEW LOCATION
				</button>
			</div>

			<div className='locations-table'>
				<div className='location-table-header'>
					<span>
						Location Name
						<div className='sort-buttons'>
							<button className='sort-asc' onClick={() => handleSort('name', 'asc')}>
								▲
							</button>
							<button className='sort-desc' onClick={() => handleSort('name', 'desc')}>
								▼
							</button>
						</div>
					</span>
					<span>
						Address
						<div className='sort-buttons'>
							<button className='sort-asc' onClick={() => handleSort('address', 'asc')}>
								▲
							</button>
							<button className='sort-desc' onClick={() => handleSort('address', 'desc')}>
								▼
							</button>
						</div>
					</span>
					<span>
						Postcode
						<div className='sort-buttons'>
							<button className='sort-asc' onClick={() => handleSort('post_code', 'asc')}>
								▲
							</button>
							<button className='sort-desc' onClick={() => handleSort('post_code', 'desc')}>
								▼
							</button>
						</div>
					</span>
					<span>
						Phone Number
						<div className='sort-buttons'>
							<button className='sort-asc' onClick={() => handleSort('phone_number', 'asc')}>
								▲
							</button>
							<button className='sort-desc' onClick={() => handleSort('phone_number', 'desc')}>
								▼
							</button>
						</div>
					</span>
					<span>Action</span>
				</div>

				{/* Render filtered locations */}
				{filteredLocations.length > 0 ? (
					filteredLocations.map((location) => (
						<div key={location.id} className='location-table-row'>
							<span data-label='Location Name'>{location.name}</span>
							<span data-label='Address'>{location.address}</span>
							<span data-label='Postcode'>{location.post_code}</span>
							<span data-label='Phone Number'>{location.phone_number}</span>
							<span data-label='Action'>
								<div className='actionicon'>
									<i className='fa fa-pencil' onClick={() => handleEdit(location)}></i>
									<i className='fa fa-trash' onClick={() => confirmDelete(location)}></i>
								</div>
							</span>
						</div>
					))
				) : (
					<div className='location-table-row'>
						<span>No locations found.</span>
					</div>
				)}
			</div>

			{isAddOpen && (
				<Modal setOpen={setIsAddOpen} open={isAddOpen}>
					<AddLocationModal closeAddModal={closeAddModal} />
				</Modal>
			)}

			{isDeleteOpen && activeLocation && (
				<Modal setOpen={setIsDeleteOpen} open={isDeleteOpen}>
					<DeleteLocationModal
						handleDelete={handleDelete}
						activeLocation={activeLocation}
						closeDeleteModal={closeDeleteModal}
					/>
				</Modal>
			)}

			{isEditOpen && activeLocation && (
				<Modal setOpen={setIsEditOpen} open={isEditOpen}>
					<EditLocationModal activeLocation={activeLocation} closeEditModal={closeEditModal} />
				</Modal>
			)}
		</div>
	);
};

export default LocationList;

function DeleteLocationModal({ handleDelete, activeLocation, closeDeleteModal }) {
	return (
		<div className='delete-modal'>
			<p>Are you sure you want to delete {activeLocation.name}?</p>
			<div className='button-container'>
				<button onClick={() => handleDelete(activeLocation.id)} className='confirm-button'>
					Confirm
				</button>
				<button className='cancel-button' onClick={closeDeleteModal}>
					Cancel
				</button>
			</div>
		</div>
	);
}
