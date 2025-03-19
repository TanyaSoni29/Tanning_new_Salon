/** @format */

// console.log("My URI", process.env.REACT_APP_BASE_URI);
// const BASE_URL = "http://localhost:3000/api/v1";
// const BASE_URL = 'https://salon.thetechnoguyz.com/api';
const BASE_URL = process.env.REACT_APP_BASE_URL;

export const endpoints = {
	SIGNUP_API: BASE_URL + '/register',
	LOGIN_API: BASE_URL + '/login',
	GET_ME_API: BASE_URL + '/me',
	ADD_CUSTOMER: BASE_URL + '/AddCustomer',
	// UPDATE_PASSWORD_API: BASE_URL + "/user/updatePassword",
	RESET_PASSWORD_API: BASE_URL + '/password/reset',
	FORGET_PASSWORD_API: BASE_URL + '/password/forget',
};

export const locationEndpoints = {
	GET_ALL_LOCATION_API: BASE_URL + '/locations',
};

export const userEndpoints = {
	GET_ALL_USERS: BASE_URL + '/users',
	GET_ALL_CUSTOMER_REPORT: BASE_URL + '/getUserd',
	GET_CUSTOMERS_BY_LOCATION_DATE: BASE_URL + '/getUserByLocationAndDate',
	RESET_PASSWORD_API: BASE_URL + '/password/reset',
	DELETE_ALL_API: BASE_URL + '/clearData',
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
	GET_ALL_USER_PROFILE_API: BASE_URL + '/user-profiles',
};

export const productEndpoints = {
	GET_ALL_PRODUCT_API: BASE_URL + '/products',
	GET_ALL_PRODUCT_TRANSACTION_API: BASE_URL + '/product-transactions',
	GET_PRODUCT_REPORT: BASE_URL + '/product-saled-report',
};

export const serviceEndpoints = {
	GET_ALL_SERVICE_TRANSACTION_API: BASE_URL + '/service-transactions',
	GET_ALL_SERVICE_API: BASE_URL + '/services',
	GET_ADDMINUTES_SERVICE_API: BASE_URL + '/update/minutes',
	GET_USE_SERVICE_OPTION: BASE_URL + '/getTransaction',
	GET_TOTAL_SPEND: BASE_URL + '/totalSpend',
	GET_SERVICE_REPORT: BASE_URL + '/service-purchase-report',
	GET_SERVICE_USE_REPORT: BASE_URL + '/service-use-report',
	GET_SERVICE_DAILY_USES_REPORT: BASE_URL + '/customerDayUsage',

	// GET_ALL_SERVICE_USAGES_API: BASE_URL + "/serviceUsage",
	// GET_ALL_SERVICE_USAGES_BY_USERID_API: BASE_URL + "/serviceUsage/user",
};

export const statsEndpoint = {
	GET_ALL_STATS: BASE_URL + '/stats',
};
