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
	console.log(locations);
	const [searchTerm, setSearchTerm] = useState('');
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [isEditOpen, setIsEditOpen] = useState(false); // Control delete modal/confirmation
	const [isAddOpen, setIsAddOpen] = useState(false);
	const [activeLocation, setActiveLocation] = useState(null); // Track the location to be deleted

	// Filter locations based on search term
	const filteredLocations = locations.filter(
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
				<button
					className='add-button1'
					onClick={() => handleAdd()}
				>
					ADD NEW LOCATION
				</button>
			</div>

			<div className='locations-table'>
				<div className='location-table-header'>
					<span>LOCATION NAME</span>
					<span>ADDRESS</span>
					<span>POSTCODE</span>
					<span>PHONE NUMBER</span>
					<span>ACTION</span>
				</div>

				{/* Render filtered locations */}
				{filteredLocations.length > 0 ? (
					filteredLocations.map((location) => (
						<div
							key={location.id}
							className='location-table-row'
						>
							<span>{location.name}</span>
							<span>{location.address}</span>
							<span>{location.post_code}</span>
							<span>{location.phone_number}</span>
							<span>
								<i
									className='fa fa-pencil'
									onClick={() => handleEdit(location)}
								></i>
								<i
									className='fa fa-trash'
									onClick={() => confirmDelete(location)} // Open delete modal
								></i>
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
				<Modal
					setOpen={setIsAddOpen}
					open={isAddOpen}
				>
					<AddLocationModal closeAddModal={closeAddModal} />
				</Modal>
			)}
			{/* Delete Confirmation Modal/Alert */}
			{isDeleteOpen && activeLocation && (
				<Modal
					setOpen={setIsDeleteOpen}
					open={isDeleteOpen}
				>
					<DeleteLocationModal
						handleDelete={handleDelete}
						activeLocation={activeLocation}
						closeDeleteModal={closeDeleteModal}
					/>
				</Modal>
			)}

			{isEditOpen && activeLocation && (
				<Modal
					setOpen={setIsEditOpen}
					open={isEditOpen}
				>
					<EditLocationModal
						activeLocation={activeLocation}
						closeEditModal={closeEditModal}
					/>
				</Modal>
			)}
		</div>
	);
};

export default LocationList;

function DeleteLocationModal({
	handleDelete,
	activeLocation,
	closeDeleteModal,
}) {
	return (
		<div className='delete-modal'>
			<p>Are you sure you want to delete {activeLocation.name}?</p>
			<div className='button-container'>
				<button
					onClick={() => handleDelete(activeLocation.id)}
					className='confirm-button'
				>
					Confirm
				</button>
				<button
					className='cancel-button'
					onClick={closeDeleteModal}
				>
					Cancel
				</button>
			</div>
		</div>
	);
}
