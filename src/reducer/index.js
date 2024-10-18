import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "../slices/authSlice";
import userProfileReducer from "../slices/userProfileSlice";
import productReducer from "../slices/productSlice";
import serviceReducer from "../slices/serviceSlice";
import locationReducer from "../slices/locationSlice";
import customerReducer from "../slices/customerProfile";
const rootReducer = combineReducers({
  auth: authReducer,
  userProfile: userProfileReducer,
  customer: customerReducer,
  product: productReducer,
  service: serviceReducer,
  location: locationReducer,
});

export default rootReducer;
