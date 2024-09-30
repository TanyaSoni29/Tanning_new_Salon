// console.log("My URI", process.env.REACT_APP_BASE_URI);
// const BASE_URL = "http://localhost:3000/api/v1";
const BASE_URL = "https://salon.thetechnoguyz.com/api";

export const endpoints = {
  SIGNUP_API: BASE_URL + "/register",
  LOGIN_API: BASE_URL + "/login",
  GET_ME_API: BASE_URL + "/me",
  // UPDATE_PASSWORD_API: BASE_URL + "/user/updatePassword",
  RESET_PASSWORD_API: BASE_URL + "/password/reset",
  FORGET_PASSWORD_API: BASE_URL + "/password/forget",
};

export const locationEndpoints = {
  GET_ALL_LOCATION_API: BASE_URL + "/locations",
};

export const userEndpoints = {
  GET_ALL_USERS: BASE_URL + "/getUser",
  // CREATE_CUSTOMER_API: BASE_URL + "/createCustomer",
  // DELETE_CUSTOMER_API: BASE_URL + "/deleteCustomer",
  // CREATE_USER_API: BASE_URL + "/createUser",
  // DELETE_USER_API: BASE_URL + "/deleteUser",
  // TOTAL_SALES_API: BASE_URL + "/totalSales",
  // SALES_BY_LOCATION_API: BASE_URL + "/salesByLocation",
  // TOP_CUSTOMER_API: BASE_URL + "/topCustomer",
  // GET_SERVICE_TRANSACTIONS_BY_USER: BASE_URL + "/serviceTransactions",
  // GET_PRODUCT_TRANSACTIONS_BY_USER: BASE_URL + "/productTransactions",
};

export const userProfileEndpoints = {
  // GET_USER_DETAILS_API: BASE_URL + "/userProfile/userDetails",
  // UPDATE_USER_PROFILE_IMAGE_API: BASE_URL + "/userProfile/updateProfileImage",
  GET_ALL_USER_PROFILE_API: BASE_URL + "/user-profiles",
};

export const productEndpoints = {
  GET_ALL_PRODUCT_API: BASE_URL + "/products",
  GET_ALL_PRODUCT_TRANSACTION_API: BASE_URL + "/product-transactions",
};

export const serviceEndpoints = {
  GET_ALL_SERVICE_TRANSACTION_API: BASE_URL + "/service-transactions",
  GET_ALL_SERVICE_API: BASE_URL + "/services",
  GET_USE_SERVICE_OPTION: BASE_URL + "/getTransaction",
  // GET_ALL_SERVICE_USAGES_API: BASE_URL + "/serviceUsage",
  // GET_ALL_SERVICE_USAGES_BY_USERID_API: BASE_URL + "/serviceUsage/user",
};
