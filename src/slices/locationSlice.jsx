import { createSlice } from "@reduxjs/toolkit";
import { getAllLocations } from "service/operations/locationApi";

const initialState = {
  locationIndex: null,
  loading: false,
  locations: [],
};

const locationSlice = createSlice({
  name: "location",
  initialState: initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setLocations: (state, action) => {
      state.locations = action.payload;
      state.loading = false;
    },
    setLocationIndex: (state, action) => {
      state.locationIndex = action.payload;
      state.loading = false;
    },
    addLocation: (state, action) => {
      state.locations.push(action.payload);
      state.loading = false;
    },
    updateLocation: (state, action) => {
      const index = state.locations.findIndex((location) => location.id === action.payload.id);
      if (index !== -1) {
        state.locations[index] = action.payload;
      }
      state.loading = false;
    },
    removeLocation: (state, action) => {
      state.locations = state.locations.filter((location) => location.id !== action.payload);
      state.loading = false;
    },
  },
});

export function refreshLocation() {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    try {
      const response = await getAllLocations(token);
      const sortLocation = response.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      dispatch(setLocations(sortLocation));
    } catch (error) {
      console.error("Failed to refresh users:", error);
    }
  };
}

export const {
  setLocations,
  setLoading,
  setLocationIndex,
  addLocation,
  updateLocation,
  removeLocation,
} = locationSlice.actions;
export default locationSlice.reducer;
