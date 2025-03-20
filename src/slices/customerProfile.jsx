/** @format */

import { createSlice } from '@reduxjs/toolkit';
import {
	getAllUser,
	getCustomerById,
	getCustomerSearch,
} from '../service/operations/userApi';

const initialState = {
	customer: null,
	loading: false,
	customers: [],
	searchCustomers: [],
};

const customerProfileSlice = createSlice({
	name: 'customer',
	initialState: initialState,
	reducers: {
		setLoading: (state, action) => {
			state.loading = action.payload;
		},
		setCustomers: (state, action) => {
			state.customers = action.payload;
			state.loading = false;
		},
		setCustomer: (state, action) => {
			state.customer = action.payload;
			state.loading = false;
		},
		addCustomer: (state, action) => {
			state.customers.push(action.payload);
			state.loading = false;
		},
		updateCustomer: (state, action) => {
			const index = state.customers.findIndex(
				(user) => user.id === action.payload.id
			);
			if (index !== -1) {
				state.customers[index] = action.payload;
			}
			state.loading = false;
		},
		removeCustomer: (state, action) => {
			state.customers = state.customers.filter(
				(user) => user.id !== action.payload
			);
			state.loading = false;
		},
		setSearchCustomers: (state, action) => {
			state.searchCustomers = action.payload;
		},
	},
});

export function refreshCustomers() {
	return async (dispatch, getState) => {
		const token = getState().auth.token;
		const selectedCustomerId = getState().customer.customer?.user.id;
		const currentCustomer = getState().customer.customer;
		console.log(selectedCustomerId);
		try {
			const response = await getAllUser(token);
			const customers = response?.filter(
				(data) => data?.user?.role === 'customer'
			);
			dispatch(setCustomers(customers));
			if (selectedCustomerId) {
				const updatedCustomer = customers?.find(
					(customer) => customer?.user?.id === selectedCustomerId
				);
				console.log('updatedCustomer finding', updatedCustomer);
				if (
					updatedCustomer &&
					JSON.stringify(updatedCustomer) !== JSON.stringify(currentCustomer)
				) {
					dispatch(setCustomer(updatedCustomer));
				}
			}
		} catch (error) {
			console.error('Failed to refresh users:', error);
		}
	};
}

export function refreshSearchCustomers(keyword, location) {
	return async (dispatch, getState) => {
		const token = getState().auth.token;
		const selectedCustomerId = getState().customer.customer?.user.id;
		const currentCustomer = getState().customer.customer;

		try {
			const response = await getCustomerSearch(token, keyword, location);
			console.log('redux---', response);
			dispatch(setSearchCustomers(response.data));
			if (selectedCustomerId) {
				const updatedCustomer = response.find(
					(customer) => customer?.user.id === selectedCustomerId
				);
				console.log('updatedCustomer finding', updatedCustomer);
				if (
					updatedCustomer &&
					JSON.stringify(updatedCustomer) !== JSON.stringify(currentCustomer)
				) {
					dispatch(setCustomer(updatedCustomer));
				}
			}
		} catch (error) {
			console.error('Failed to refresh users:', error);
		}
	};
}

export function refreshSelectedCustomer(id) {
	return async (dispatch, getState) => {
		const token = getState().auth.token;
		try {
			const response = await getCustomerById(token, id);
			dispatch(setCustomer(response));
		} catch (error) {
			console.log(error);
		}
	};
}

export const {
	setCustomers,
	setLoading,
	setCustomer,
	addCustomer,
	updateCustomer,
	removeCustomer,
	setSearchCustomers,
} = customerProfileSlice.actions;
export default customerProfileSlice.reducer;
