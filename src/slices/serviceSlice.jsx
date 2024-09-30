import { createSlice } from "@reduxjs/toolkit";
import { getAllServices } from "service/operations/serviceAndServiceTransaction";

const initialState = {
  services: [],
  serviceIndex: null,
  loading: false,
};

const serviceSlice = createSlice({
  name: "service",
  initialState: initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setServices: (state, action) => {
      state.services = action.payload;
      state.loading = false;
    },
    setServiceIndex: (state, action) => {
      state.serviceIndex = action.payload;
      state.loading = false;
    },
    addService: (state, action) => {
      state.services.push(action.payload);
      state.loading = false;
    },
    updateService: (state, action) => {
      const index = state.services.findIndex((service) => service.id === action.payload.id);
      if (index !== -1) {
        state.services[index] = action.payload;
      }
      state.loading = false;
    },
    removeService: (state, action) => {
      state.services = state.services.filter((service) => service.id !== action.payload);
      state.loading = false;
    },
  },
});

export function refreshService() {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    try {
      const response = await getAllServices(token);
      dispatch(setServices(response));
    } catch (error) {
      console.error("Failed to refresh services:", error);
    }
  };
}

export const {
  setLoading,
  setServices,
  setServiceIndex,
  addService,
  updateService,
  removeService,
} = serviceSlice.actions;
export default serviceSlice.reducer;
