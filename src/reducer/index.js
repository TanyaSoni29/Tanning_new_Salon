import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "../slices/authSlice";
import profileReducer from "../slices/profileSlice";
import productReducer from "../slices/productSlice";
import serviceReducer from "../slices/serviceSlice";
import locationReducer from "../slices/locationSlice";
const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  product: productReducer,
  service: serviceReducer,
  location: locationReducer,
});

export default rootReducer;
