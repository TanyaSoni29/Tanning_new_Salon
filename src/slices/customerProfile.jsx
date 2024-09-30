/** @format */

import { createSlice } from "@reduxjs/toolkit";
import { getAllUser } from "../service/operations/userApi";

const initialState = {
  customersIndex: null,
  loading: false,
  customers: [],
};

const customerProfileSlice = createSlice({
  name: "customer",
  initialState: initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setCustomers: (state, action) => {
      state.customers = action.payload;
      state.loading = false;
    },
    setCustomerIndex: (state, action) => {
      state.customersIndex = action.payload;
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
    try {
      const response = await getAllUser(token);
      const customers = response.filter(
        (data) => data.user.role === "customer"
      );
      dispatch(setCustomers(customers));
    } catch (error) {
      console.error("Failed to refresh users:", error);
    }
  };
}

export const {
  setCustomers,
  setLoading,
  setCustomerIndex,
  addCustomer,
  updateCustomer,
  removeCustomer,
} = customerProfileSlice.actions;
export default customerProfileSlice.reducer;
