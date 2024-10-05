/** @format */

import toast from 'react-hot-toast';
import { statsEndpoint } from '../api';
import { apiConnector } from '../apiConnector';

const { GET_ALL_STATS } = statsEndpoint;

export const getStats = async (token, locationId) => {
	let result = [];
	try {
		const response = await apiConnector(
			'GET',
			`${GET_ALL_STATS}/${locationId}`,
			null,
			{
				Authorization: `Bearer ${token}`,
			}
		);
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
