/** @format */

import { toast } from 'react-hot-toast';
import { apiConnector } from '../apiConnector';
import { locationEndpoints } from '../api';

const { GET_ALL_LOCATION_API } = locationEndpoints;

export const createLocation = async (token, data) => {
	try {
		const response = await apiConnector('POST', GET_ALL_LOCATION_API, data, {
			'Authorization': `Bearer ${token}`,
			'Content-Type': 'application/json',
		});

		console.log('Create New Location Api Response..', response);
		if (response.status !== 201) throw new Error('Could not create Location');
		toast.success('Location created successfully');
		return response.data;
	} catch (error) {
		console.log('Create Location Api Error', error);
		const errorMessage = error.response?.data?.error;
		toast.error(errorMessage);
	}
};

export const getAllLocations = async (token) => {
	let result = [];
	try {
		const response = await apiConnector('GET', GET_ALL_LOCATION_API, null, {
			Authorization: `Bearer ${token}`,
		});
		console.log('Get All Locations Api Response..', response);
		if (response.status !== 200) throw new Error('Could not fetch Locations');
		result = response?.data;
	} catch (error) {
		console.log('Get All Locations Api Error', error);
		const errorMessage = error.response?.data.error;
		toast.error(errorMessage);
	}
	return result;
};

export const updateLocation = async (token, locationId, data) => {
	let result = null;
	try {
		const response = await apiConnector(
			'PUT',
			`${GET_ALL_LOCATION_API}/${locationId}`,
			data,
			{
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json',
			}
		);
		console.log('Update Location Api Response..', response);
		if (response.status !== 200) throw new Error('Could not update Location');
		toast.success('Location updated successfully');
		result = response.data;
	} catch (error) {
		console.log('Update Location Api Error', error);
		const errorMessage = error.response?.data?.error;
		toast.error(errorMessage);
	}
	return result;
};

export const getLocation = async (token, locationId) => {
	let result = null;
	try {
		const response = await apiConnector(
			'GET',
			`${GET_ALL_LOCATION_API}/${locationId}`,
			null,
			{
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json',
			}
		);

		console.log('Get Location Api Response..', response);
		if (response.status !== 200) throw new Error('Could not fetch Location');
		result = response.data;
	} catch (error) {
		console.log('Get Location Api Error', error);
		const errorMessage = error.response?.data.error;
		toast.error(errorMessage);
	}
	return result;
};

export const deleteLocation = async (token, locationId) => {
	let result = false;
	try {
		const response = await apiConnector(
			'DELETE',
			`${GET_ALL_LOCATION_API}/${locationId}`,
			null,
			{
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json',
			}
		);
		console.log('Delete Location Api Response..', response);
		if (response.status !== 200) throw new Error('Could not delete Location');
		toast.success('Location deleted successfully');
		result = true;
	} catch (error) {
		console.log('Delete Location Api Error', error);
		toast.error(error.response.data.message)
	}
	return result;
};
