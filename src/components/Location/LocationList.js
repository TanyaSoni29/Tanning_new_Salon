/** @format */

import React, { useEffect, useState } from 'react';
import './LocationList.css'; // Importing CSS
import { useDispatch, useSelector } from 'react-redux';
import {
	removeLocation,
	refreshLocation,
	updateLocationStatus,
} from '../../slices/locationSlice'; // Import removeLocation and refreshLocation actions
import {
	deleteLocation,
	updateLocation,
} from '../../service/operations/locationApi';
import Modal from '../Modal'; // Assuming deleteLocation API call
import EditLocationModal from './EditLocationModal';
import AddLocationModal from './AddLocationModal';
import { Switch } from '@mui/material';
import toast from 'react-hot-toast';
import { IoIosArrowBack } from 'react-icons/io';
import { IoIosArrowForward } from 'react-icons/io';
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
	const [currentPage, setCurrentPage] = useState(1);
	const locationsPerPage = 10;

	useEffect(() => {
		setCurrentPage(1);
	}, [searchTerm]);
	// Handle sort toggling between ascending and descending
	const handleSort = (key) => {
		let direction = 'asc';
		if (sortConfig.key === key && sortConfig.direction === 'asc') {
			direction = 'desc';
		}
		setSortConfig({ key, direction });
	};

	// Function to display the correct icon for sorting
	const getSortIcon = (key) => {
		if (sortConfig.key === key) {
			return sortConfig.direction === 'asc' ? '▲' : '▼';
		}
		return '▲'; // Default icon
	};

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

	const indexOfLastLocation = currentPage * locationsPerPage;
	const indexOfFirstLocation = indexOfLastLocation - locationsPerPage;
	const currentLocations = filteredLocations.slice(
		indexOfFirstLocation,
		indexOfLastLocation
	);
	const totalPages = Math.ceil(filteredLocations.length / locationsPerPage);

	const handleNextPage = () => {
		if (currentPage < totalPages) setCurrentPage(currentPage + 1);
	};

	const handlePrevPage = () => {
		if (currentPage > 1) setCurrentPage(currentPage - 1);
	};

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

	const handleToggleActiveStatus = async (location) => {
		const updatedStatus = !location.isActive;
		const activeLocations = locations.filter((loc) => loc.isActive);

		// Edge case: Ensure at least one location remains active
		if (activeLocations.length === 1 && location.isActive) {
			toast.error('At least one location must remain active.');
			return;
		}
		try {
			// Call API to update location status
			const result = await updateLocation(token, location.id, {
				isActive: updatedStatus,
			});

			// If the update was successful, refresh the locations in Redux
			if (result) {
				dispatch(
					updateLocationStatus({ id: location.id, isActive: updatedStatus })
				);
				dispatch(refreshLocation());
			}
		} catch (error) {
			console.error('Error updating location status:', error);
		}
	};

	const PaginationControls = () => (
		<div className='pagination-controls'>
			<button
				onClick={handlePrevPage}
				disabled={currentPage === 1}
			>
				<IoIosArrowBack fontSize={18} />
			</button>
			<button
				onClick={handleNextPage}
				disabled={currentPage === totalPages}
			>
				<IoIosArrowForward fontSize={18} />
			</button>
			<span>
				Page {currentPage} of {totalPages}
			</span>
		</div>
	);

	return (
		<div className='location-container'>
			<div className='location-search-container'>
				<input
					type='text'
					placeholder='Search Location'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
				{/* <button
					className='add-button1'
					onClick={() => handleAdd()}
				>
					Add New Location
				</button> */}
			</div>

			<div className='locations-table'>
				<div className='location-table-header'>
					<span>
						Location
						<button
							className='sort-button'
							onClick={() => handleSort('locationId')}
						>
							{getSortIcon('locationId')}
						</button>
					</span>
					<span>
						Name
						<button
							className='sort-button'
							onClick={() => handleSort('name')}
						>
							{getSortIcon('name')}
						</button>
					</span>
					<span>
						Address
						<button
							className='sort-button'
							onClick={() => handleSort('address')}
						>
							{getSortIcon('address')}
						</button>
					</span>
					<span>
						Postcode
						<button
							className='sort-button'
							onClick={() => handleSort('post_code')}
						>
							{getSortIcon('post_code')}
						</button>
					</span>
					<span>
						Phone Number
						<button
							className='sort-button'
							onClick={() => handleSort('phone_number')}
						>
							{getSortIcon('phone_number')}
						</button>
					</span>
					<span>IsActive</span>
					<span>Action</span>
				</div>

				{/* Render filtered locations */}
				{currentLocations.length > 0 ? (
					currentLocations.map((location) => (
						<div
							key={location.id}
							className='location-table-row'
						>
							<span data-label='Location Id'>
								{location?.location_id ? location?.location_id : '-'}
							</span>
							<span data-label='Location Name'>
								{location.name ? location.name : '-'}
							</span>
							<span data-label='Address'>
								{location.address ? location.address : '-'}
							</span>
							<span data-label='Postcode'>
								{location.post_code ? location.post_code : '-'}
							</span>
							<span data-label='Phone Number'>
								{location.phone_number ? location.phone_number : '-'}
							</span>
							<span data-label='Is Active'>
								<Switch
									checked={location.isActive}
									onChange={() => handleToggleActiveStatus(location)}
									color='primary'
								/>
							</span>
							<span data-label='Action'>
								<div className='actionicon'>
									<i
										className='fa fa-pencil'
										onClick={() => handleEdit(location)}
									></i>
									{/* <i
										className='fa fa-trash'
										onClick={() => confirmDelete(location)}
									></i> */}
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
			{totalPages > 1 && <PaginationControls />}
			{isAddOpen && (
				<Modal
					setOpen={setIsAddOpen}
					open={isAddOpen}
				>
					<AddLocationModal closeAddModal={closeAddModal} />
				</Modal>
			)}

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
