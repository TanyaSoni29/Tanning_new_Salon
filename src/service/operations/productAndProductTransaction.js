/** @format */

import { toast } from 'react-hot-toast';
import { apiConnector } from '../apiConnector';
import { productEndpoints } from '../api';
import { setLoading } from '../../slices/productSlice';

const {
	GET_ALL_PRODUCT_API,
	GET_ALL_PRODUCT_TRANSACTION_API,
	GET_PRODUCT_REPORT,
} = productEndpoints;

export const createProduct = async (token, data) => {
	try {
		const response = await apiConnector('POST', GET_ALL_PRODUCT_API, data, {
			'Authorization': `Bearer ${token}`,
			'Content-Type': 'application/json',
		});

		console.log('Create New Product Api Response..', response);
		if (response.status !== 201) throw new Error('Could not create Product');
		toast.success('Product created successfully');
		return response.data;
	} catch (error) {
		console.log('Create Product Api Error', error);
		const errorMessage = error?.response?.data?.error;
		toast.error(errorMessage);
	}
};

export const getAllProducts = async (token) => {
	let result = [];
	try {
		const response = await apiConnector('GET', GET_ALL_PRODUCT_API, null, {
			Authorization: `Bearer ${token}`,
		});
		console.log('Get All Product Api Response..', response);
		if (response.status !== 200) throw new Error('Could not fetch all Product');
		result = response.data;
	} catch (error) {
		console.log('Get All Product Api Error', error);
		const errorMessage = error.response?.data?.error;
		toast.error(errorMessage);
	}
	return result;
};

export const updateProduct = async (token, productId, data) => {
	let result = null;
	try {
		const response = await apiConnector(
			'PUT',
			`${GET_ALL_PRODUCT_API}/${productId}`,
			data,
			{
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json',
			}
		);
		console.log('Update Product Api Response..', response);
		if (response.status !== 200) throw new Error('Could not update Product');
		toast.success('Product updated successfully');
		result = response.data;
	} catch (error) {
		console.log('Update Product Api Error', error);
		const errorMessage = error.response?.data?.error;
		toast.error(errorMessage);
	}
	return result;
};

// export const getProduct = async (token, productId) => {
// 	let result = null;
// 	try {
// 		const response = await apiConnector(
// 			'GET',
// 			`${GET_ALL_PRODUCT_API}/${productId}`,
// 			null,
// 			{
// 				'Authorization': `Bearer ${token}`,
// 				'Content-Type': 'application/json',
// 			}
// 		);

// 		console.log('Get Product Api Response..', response);
// 		if (response.status !== 200) throw new Error('Could not fetch Product');
// 		result = response.data;
// 	} catch (error) {
// 		console.log('Get Product Api Error', error);
// 		const errorMessage = error.response?.data?.error;
// 		toast.error(errorMessage);
// 	}
// 	return result;
// };

export const deleteProduct = async (token, productId) => {
	let result = false;
	try {
		const response = await apiConnector(
			'DELETE',
			`${GET_ALL_PRODUCT_API}/${productId}`,
			undefined,
			{
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json',
			}
		);
		console.log('Delete Product Api Response..', response);
		if (response.status !== 200) throw new Error('Could not delete Product');
		toast.success('Product deleted successfully');
		result = true;
	} catch (error) {
		console.log('Delete Product Api Error', error);
		const errorMessage = error.response?.data?.error;
		toast.error(errorMessage);
	}
	return result;
};

export const createProductTransaction = async (token, data) => {
	try {
		const response = await apiConnector(
			'POST',
			GET_ALL_PRODUCT_TRANSACTION_API,
			data,
			{
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json',
			}
		);

		console.log('Create New Product Transaction Api Response..', response);
		if (response.status !== 201) throw new Error('Could not create Product');
		toast.success('Product Transaction created successfully');
		return response.data;
	} catch (error) {
		console.log('Create Product Transaction Api Error', error);
		const errorMessage = error.response?.data?.error;
		toast.error(errorMessage);
	}
};

export const getAllProductTransactions = async (token) => {
	let result = null;
	try {
		const response = await apiConnector(
			'GET',
			GET_ALL_PRODUCT_TRANSACTION_API,
			null,
			{
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json',
			}
		);
		if (response.status !== 200)
			throw new Error('Could not fetch All Product Transaction');
		console.log('Fetch product transactions api---', response.data);
		// toast.success("All Product Transactions fetched successfully");
		result = response.data;
	} catch (error) {
		console.log('Fetch product transactions api error', error);
		const errorMessage = error.response?.data?.error;
		if (error.response.status !== 404) {
			toast.error(errorMessage);
		}
	}
	return result;
};

export const getProductTransactionsByUser = async (token, userId) => {
	let result = null;
	try {
		const response = await apiConnector(
			'GET',
			`${GET_ALL_PRODUCT_TRANSACTION_API}/${userId}`,
			null,
			{
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json',
			}
		);
		console.log('Get User Product transactions Api Response..', response);
		if (response.status !== 200)
			throw new Error('Could not fetch User transactions');
		// toast.success("User Transactions fetch successfully");
		result = response.data;
	} catch (error) {
		console.log('Get User Product transactions Api Error', error);
		const errorMessage = error?.response?.data?.error;
		toast.error(errorMessage);
	}
	return result;
};

export const getProductReport = async (token, data) => {
	let result = null;
	try {
		const response = await apiConnector(
			'POST',
			GET_PRODUCT_REPORT,
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
