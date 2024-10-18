/** @format */

import { toast } from 'react-hot-toast';
import { apiConnector } from '../apiConnector';
import { serviceEndpoints } from '../api';

const {
	GET_ALL_SERVICE_TRANSACTION_API,
	GET_ALL_SERVICE_API,
	GET_USE_SERVICE_OPTION,
	GET_TOTAL_SPEND,
	GET_SERVICE_REPORT,
	GET_SERVICE_USE_REPORT,
	// GET_ALL_SERVICE_USAGES_API,
	// GET_ALL_SERVICE_USAGES_BY_USERID_API,
} = serviceEndpoints;

const { GET_ADDMINUTES_SERVICE_API } = serviceEndpoints;

// Define the new function to add minutes to a service

export const createService = async (token, data) => {
	try {
		const response = await apiConnector('POST', GET_ALL_SERVICE_API, data, {
			'Authorization': `Bearer ${token}`,
			'Content-Type': 'application/json',
		});
		console.log('Create New Service Api Response..', response);
		if (response.status !== 201)
			throw new Error("Couldn't create a new service");

		toast.success('Service created successfully');
		return response.data;
	} catch (error) {
		console.log('Create service Api error...', error);
		const errorMessage = error.response?.data?.error;
		toast.error(errorMessage);
	}
};

export const getAllServices = async (token) => {
	let result = null;
	try {
		const response = await apiConnector('GET', GET_ALL_SERVICE_API, null, {
			Authorization: `Bearer ${token}`,
		});
		if (response.status !== 200) throw new Error('Could not fetch All Service');
		result = response.data;
	} catch (error) {
		console.log('Fetch all services api error', error);
		const errorMessage = error.response?.data?.error;
		toast.error(errorMessage);
	}
	return result;
};

export const getServiceById = async (token, serviceId) => {
	let result = null;
	try {
		const response = await apiConnector(
			'GET',
			`${GET_ALL_SERVICE_API}/${serviceId}`,
			null,
			{
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json',
			}
		);

		if (response.status !== 200) throw new Error("Couldn't found Service");
		result = response.data;
	} catch (error) {
		console.log('Fetch service by id api error', error);
		const errorMessage = error.response?.data?.error;
		toast.error(errorMessage);
	}
	return result;
};

export const updateService = async (token, serviceId, data) => {
	let result = null;
	try {
		const response = await apiConnector(
			'PUT',
			`${GET_ALL_SERVICE_API}/${serviceId}`,
			data,
			{
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json',
			}
		);
		console.log('Update Service Api Response...', response);
		if (response.status !== 200) throw new Error("Couldn't update Service");
		toast.success('Service updated successfully');
		result = response.data;
	} catch (error) {
		console.log('Update Service Api Error', error);
		const errorMessage = error.response?.data?.error;
		toast.error(errorMessage);
	}
	return result;
};

export const deleteService = async (token, serviceId) => {
	let result = null;
	try {
		const response = await apiConnector(
			'DELETE',
			`${GET_ALL_SERVICE_API}/${serviceId}`,
			null,
			{
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json',
			}
		);
		console.log('Delete Service Api Response..', response);
		if (response.status !== 200) throw new Error('Could not delete Service');
		toast.success('Service deleted successfully');
		result = true;
	} catch (error) {
		console.log('Delete Service Api Error', error);
		const errorMessage = error.response?.data?.error;
		toast.error(errorMessage);
	}
	return result;
};

export const createServiceTransaction = async (token, data) => {
	try {
		const response = await apiConnector(
			'POST',
			GET_ALL_SERVICE_TRANSACTION_API,
			data,
			{
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json',
			}
		);
		console.log('Create New Service Api Response..', response);
		if (response.status !== 201)
			throw new Error("Couldn't create a new service transaction");

		toast.success('Service Transaction created successfully');
		return response.data;
	} catch (error) {
		console.log('Create service transaction Api error...', error);
		const errorMessage = error.response?.data?.error;
		toast.error(errorMessage);
	}
};

export const getAllServiceTransactions = async (token) => {
	let result = null;
	try {
		const response = await apiConnector(
			'GET',
			GET_ALL_SERVICE_TRANSACTION_API,
			null,
			{
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json',
			}
		);
		console.log('get All service transaction Api Response...', response);
		if (response.status !== 200)
			throw new Error('Could not fetch All Service Transaction');
		result = response.data;
	} catch (error) {
		console.log('Fetch service transactions api error', error);
		if (error.response.status !== 404) {
			toast.error('Failed to fetch service transactions');
		}
	}
	return result;
};

export const getServiceTransactionsByUser = async (token, userId) => {
	let result = null;
	try {
		const response = await apiConnector(
			'GET',
			`${GET_ALL_SERVICE_TRANSACTION_API}/${userId}`,
			null,
			{
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json',
			}
		);
		console.log('Get User Service transactions Api Response..', response);
		if (response.status !== 200)
			throw new Error('Could not fetch User transactions');
		result = response.data;
	} catch (error) {
		console.log('Get User Service transactions Api Error', error);
		const errorMessage = error.response?.data?.error;
		toast.error(errorMessage);
	}
	return result;
};

export const getServiceUseOptions = async (token, userId) => {
	let result = null;
	try {
		const response = await apiConnector(
			'GET',
			`${GET_USE_SERVICE_OPTION}/${userId}`,
			null,
			{
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json',
			}
		);
		console.log('Get User Service transactions Api Response..', response);
		if (response.status !== 200)
			throw new Error('Could not fetch User transactions');
		result = response.data;
	} catch (error) {
		console.log('Get User Service transactions Api Error', error);
		const errorMessage = error.response?.data?.error;
		toast.error(errorMessage);
	}
	return result;
};

export const getTotalSpend = async (token, userId) => {
	let result = null;
	try {
		const response = await apiConnector(
			'GET',
			`${GET_TOTAL_SPEND}/${userId}`,
			null,
			{
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json',
			}
		);
		console.log('Get User Total Spend transactions Api Response..', response);
		if (response.status !== 200)
			throw new Error('Could not fetch User transactions');
		result = response.data;
	} catch (error) {
		console.log('Get User Service transactions Api Error', error);
		const errorMessage = error.response?.data?.error;
		toast.error(errorMessage);
	}
	return result;
};

export const getServicePurchaseReport = async (token, data) => {
	let result = null;
	try {
		const response = await apiConnector(
			'POST',
			GET_SERVICE_REPORT,
			{
				start_date: data.start_date,
				end_date: data.end_date,
				location_id: data.location_id,
			},
			{
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json',
			}
		);
		console.log('GET_PRODUCT_REPORT Api Response..', response);
		if (response.status !== 200)
			throw new Error('Could not fetch GET_PRODUCT_REPORT');
		// toast.success("User Transactions fetch successfully");
		result = response.data;
	} catch (error) {
		console.log('GET_PRODUCT_REPORT Api Error', error);
		if (error.response.status !== 404) {
			const errorMessage = error.response?.data?.error;
			toast.error(errorMessage);
		}
	}
	return result;
};

export const getServiceUseReport = async (token, data) => {
	let result = null;
	try {
		const response = await apiConnector(
			'POST',
			GET_SERVICE_USE_REPORT,
			{
				start_date: data.start_date,
				end_date: data.end_date,
				location_id: data.location_id,
			},
			{
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json',
			}
		);
		console.log('GET_SERVICE_USE_REPORT Api Response..', response);
		if (response.status !== 200)
			throw new Error('Could not fetch GET_SERVICE_USE_REPORT');
		// toast.success("User Transactions fetch successfully");
		result = response.data;
	} catch (error) {
		console.log('GET_SERVICE_USE_REPORT Api Error', error);
		if (error.response.status !== 404) {
			const errorMessage = error.response?.data?.error;
			toast.error(errorMessage);
		}
	}
	return result;
};

export const addMinutesToService = async (token, data) => {
	try {
		const response = await apiConnector(
			'POST',
			GET_ADDMINUTES_SERVICE_API,
			data,
			{
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json',
			}
		);
		console.log('Add Minutes to Service Api Response..', response);
		if (response.status !== 200)
			throw new Error("Couldn't add minutes to the service");

		toast.success('Minutes added to the service successfully');
		return response.data;
	} catch (error) {
		console.log('Add Minutes to Service Api error...', error);
		const errorMessage = error.response?.data?.error;
		toast.error(errorMessage);
	}
};

// export const getAllServiceUsage = async (token) => {
//   const toastId = toast.loading("Loading...");
//   let result = null;
//   try {
//     const response = await apiConnector("GET", GET_ALL_SERVICE_USAGES_API, null, {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     });

//     console.log("GET_ALL_SERVICE_USAGES_API response...", response);

//     if (response.status !== 200) throw new Error("Couldn't get all services usage");

//     // toast.success("All Service Usage fetched successfully");
//     result = response.data?.data;
//   } catch (error) {
//     console.log("GET_ALL_SERVICE_USAGES_API error", error);
//     toast.error("Failed to get all services usage");
//   }
//   toast.dismiss(toastId);
//   return result;
// };

// export const getAllServiceUsageByUser = async (token, userId) => {
//   const toastId = toast.loading("Loading...");
//   let result = null;
//   try {
//     const response = await apiConnector(
//       "POST",
//       GET_ALL_SERVICE_USAGES_BY_USERID_API,
//       { userId: userId },
//       {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       }
//     );

//     console.log("getAllServiceUsageByUser response...", response);

//     if (response.status !== 200) throw new Error("Couldn't get all services usage");

//     result = response.data?.data;
//   } catch (error) {
//     console.log("getAllServiceUsageByUser error", error);
//     toast.error("Failed to get all services usage");
//   }
//   toast.dismiss(toastId);
//   return result;
// };
