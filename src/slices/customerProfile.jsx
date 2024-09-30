/** @format */

import { createSlice } from '@reduxjs/toolkit';
import { getAllUser } from '../service/operations/userApi';
// import { getAllUserProfiles } from '../service/operations/userProfileApi';

const initialState = {
	customersIndex: null,
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
		setUsers: (state, action) => {
			state.users = action.payload;
			state.loading = false;
		},
		setCustomerIndex: (state, action) => {
			state.userIndex = action.payload;
			state.loading = false;
		},
		addCustomer: (state, action) => {
			state.users.push(action.payload);
			state.loading = false;
		},
		updateUser: (state, action) => {
			const index = state.users.findIndex(
				(user) => user.id === action.payload.id
			);
			if (index !== -1) {
				state.users[index] = action.payload;
			}
			state.loading = false;
		},
		removeUser: (state, action) => {
			state.users = state.users.filter((user) => user.id !== action.payload);
			state.loading = false;
		},
	},
});

export function refreshUser() {
	return async (dispatch, getState) => {
		const token = getState().auth.token;
		try {
			const response = await getAllUser(token);
			const customers = response.filter(
				(data) => data.user.role === 'customer'
			);
			dispatch(setUsers(customers));
		} catch (error) {
			console.error('Failed to refresh users:', error);
		}
	};
}

export const {
	setUsers,
	setLoading,
	setUserIndex,
	addUser,
	updateUser,
	removeUser,
} = profileSlice.actions;
export default customerProfileSlice.reducer;
