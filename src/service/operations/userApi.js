/** @format */

import { toast } from 'react-hot-toast';
import { apiConnector } from '../apiConnector';
import { endpoints, userEndpoints } from '../api';

const {
	GET_ALL_USERS,
	GET_SYSTEM_USERS,
	GET_CUSTOMERS_BY_LOCATION_DATE,
	RESET_PASSWORD_API,
	GET_ALL_CUSTOMER_REPORT,
	DELETE_ALL_API,
	// CREATE_CUSTOMER_API,
	// DELETE_CUSTOMER_API,
	// CREATE_USER_API,
	// DELETE_USER_API,
	// TOTAL_SALES_API,
	// SALES_BY_LOCATION_API,
	// TOP_CUSTOMER_API,
	// GET_SERVICE_TRANSACTIONS_BY_USER,
	// GET_PRODUCT_TRANSACTIONS_BY_USER,
} = userEndpoints;

const { ADD_CUSTOMER, CUSTOMER_SEARCH, GET_CUSTOMER_BY_ID } = endpoints;
// const { GET_ALL_USER_PROFILE_API } = userProfileEndpoints;

export const createUser = async (token, data) => {
	try {
		// Step 1: Register the user
		const response = await apiConnector(
			'POST',
			ADD_CUSTOMER,
			{
				firstName: data.firstName || '',
				lastName: data.lastName || '',
				email: data.email,
				dob: data.dob || '', // Added Date of Birth field
				password: data.password,
				password_confirmation: data.password,
				phone_number: data.phone_number,
				address: data.address || '',
				preferred_location: data.preferred_location || '',
				referred_by: data.referred_by || '',
				gender: data.gender || '',
				post_code: data.post_code,
				role: data.role,
				gdpr_sms_active: data.gdpr_sms_active || false,
				gdpr_email_active: data.gdpr_email_active || false,
			},
			{
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json',
			}
		);

		console.log('Create New User API Response:', response.data);
		if (response.status !== 201) throw new Error('Could not create User');

		toast.success('User profile created successfully');

		return response.data;
	} catch (error) {
		console.log('Create User API Error', error);
		const errorMessage = error.response?.data?.errors || 'An error occurred';
		toast.error(errorMessage);
	}
};

export const resetPassword = async (token, data) => {
	try {
		const response = await apiConnector(
			'POST',
			RESET_PASSWORD_API,
			{
				email: data.email,
				password: data.password,
			},
			{
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json',
			}
		);

		console.log('Reset Password Api Response..', response);
		if (response.status !== 200)
			throw new Error('Could not Reset Password Api');
		toast.success('Password Reset Successfully');
		return response.data;
	} catch (error) {
		console.log('Reset Password Api Error', error);
		const errorMessage = error.response?.data.message;
		toast.error(errorMessage);
	}
};

export const getAllUser = async (token) => {
	let result = [];
	try {
		const response = await apiConnector('GET', GET_ALL_USERS, null, {
			Authorization: `Bearer ${token}`,
		});
		console.log('GET_ALL_USERS Api Response..', response);
		if (response.status !== 200) throw new Error('Could not fetch Users');
		result = response?.data ? response?.data : [];
	} catch (error) {
		console.log('GET_ALL_USERS Api Error', error);
		if (error.response.status !== 404) {
			const errorMessage = error.response?.data?.error;
			toast.error(errorMessage);
		}
	}
	return result;
};

export const getAllSystemUser = async (token) => {
	let result = [];
	try {
		const response = await apiConnector('GET', GET_SYSTEM_USERS, null, {
			Authorization: `Bearer ${token}`,
		});
		console.log('GET_SYSTEM_USERS Api Response..', response);
		if (response.status !== 200) throw new Error('Could not fetch Users');
		result = response?.data ? response?.data : [];
	} catch (error) {
		console.log('GET_SYSTEM_USERS Api Error', error);
		if (error.response.status !== 404) {
			const errorMessage = error.response?.data?.error;
			toast.error(errorMessage);
		}
	}
	return result;
};

export const getCustomerSearch = async (token, key, locationId) => {
	const toastId = toast.loading('Loading...');
	let result = [];
	try {
		const response = await apiConnector(
			'GET',
			CUSTOMER_SEARCH(key, locationId),
			null,
			{
				Authorization: `Bearer ${token}`,
			}
		);
		console.log('CUSTOMER_SEARCH Api Response..', response);
		if (response.status !== 200)
			throw new Error('Could not fetch Customer Search');
		result = response?.data ? response?.data : [];
	} catch (error) {
		console.log('CUSTOMER_SEARCH Api Error', error);
		if (error.response.status !== 404) {
			const errorMessage = error.response?.data?.error;
			toast.error(errorMessage);
		}
	}
	toast.dismiss(toastId);
	return result;
};

export const getAllCustomerReport = async (token, data) => {
	let result = [];
	try {
		const response = await apiConnector(
			'POST',
			GET_ALL_CUSTOMER_REPORT,
			{
				start_date: data.start_date,
				end_date: data.end_date,
				location_id: data.location_id,
			},
			{
				Authorization: `Bearer ${token}`,
			}
		);
		console.log('getAllCustomerReport Response..', response);
		if (response.status !== 200)
			throw new Error('Could not fetch getAllCustomerReport');
		result = response.data;
	} catch (error) {
		console.log('getAllCustomerReport Error', error);
		if (error.response.status !== 404) {
			const errorMessage = error.response?.data?.error;
			toast.error(errorMessage);
		}
	}
	return result;
};

export const getCustomerById = async (token, id) => {
	let result = null;
	try {
		const response = await apiConnector('GET', GET_CUSTOMER_BY_ID(id), null, {
			Authorization: `Bearer ${token}`,
		});
		console.log('GET_CUSTOMER_BY_ID Api Response..', response);
		if (response.status !== 200)
			throw new Error('Could not fetch this Customer');
		result = response?.data ? response?.data : null;
	} catch (error) {
		console.log('GET_CUSTOMER_BY_ID Api Error', error);
		if (error.response.status !== 404) {
			const errorMessage = error.response?.data?.error;
			toast.error(errorMessage);
		}
	}
	return result;
};

// export const getSalesByLocation = async (token, locationId) => {
//   const toastId = toast.loading("Loading...");
//   let result = null;
//   try {
//     const response = await apiConnector(
//       "POST",
//       SALES_BY_LOCATION_API,
//       { locationId },
//       {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       }
//     );
//     console.log("Sales By Location Api Response..", response);
//     if (response.status !== 200) throw new Error("Could not fetch Sales By Location");
//     toast.success("Sales By Location fetched successfully");
//     result = response.data?.data;
//   } catch (error) {
//     console.log("Sales By Location Api Error", error);
//     const errorMessage = error.response?.data?.message;
//     toast.error(errorMessage);
//   }
//   toast.dismiss(toastId);
//   return result;
// };

export const getCustomerByDateAndLocation = async (token, data) => {
	let result = [];
	try {
		const response = await apiConnector(
			'POST',
			GET_CUSTOMERS_BY_LOCATION_DATE,
			data,
			{
				Authorization: `Bearer ${token}`,
			}
		);
		console.log(
			'Get All Customer by date and location Api Response..',
			response
		);
		if (response.status !== 200) throw new Error('Could not fetch Users');
		result = response.data;
	} catch (error) {
		console.log('Get All User Api Error', error);
		const errorMessage = error.response?.data?.error;
		toast.error(errorMessage);
	}
	return result;
};

export const deleteAllData = async (token) => {
	let result = false;
	try {
		const response = await apiConnector('GET', DELETE_ALL_API, null, {
			Authorization: `Bearer ${token}`,
		});

		if (response.status !== 200) throw new Error('Could not fetch Users');

		toast.success('All Data deleted successfully');
		result = true;
	} catch (error) {
		console.log(error);
		const errorMessage = error.response?.data?.message;
		toast.error(errorMessage);
	}
	return result;
};
