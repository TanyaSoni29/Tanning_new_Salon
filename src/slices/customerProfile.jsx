/** @format */

import { createSlice } from '@reduxjs/toolkit';
import { getAllUser } from '../service/operations/userApi';

const initialState = {
	customer: null,
	loading: false,
	customers: [],
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
	},
});

export function refreshCustomers() {
	return async (dispatch, getState) => {
		const token = getState().auth.token;
		const selectedCustomerId = getState().customer.customer?.user.id;
		// console.log(selectedCustomerId);
		try {
			const response = await getAllUser(token);
			const customers = response.filter(
				(data) => data.user?.role === 'customer'
			);
			dispatch(setCustomers(customers));
			if (selectedCustomerId) {
				const updatedCustomer = customers.find(
					(customer) => customer?.user.id === selectedCustomerId
				);
				// console.log("updatedCustomer finding",updatedCustomer);
				if (updatedCustomer) {
					dispatch(setCustomer(updatedCustomer));
				}
			}
		} catch (error) {
			console.error('Failed to refresh users:', error);
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
} = customerProfileSlice.actions;
export default customerProfileSlice.reducer;
