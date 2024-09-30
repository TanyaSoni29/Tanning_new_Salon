import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { endpoints, userEndpoints, userProfileEndpoints } from "../api";

const {
  GET_ALL_USERS,
  // CREATE_CUSTOMER_API,
  // DELETE_CUSTOMER_API,
  // CREATE_USER_API,
  // DELETE_USER_API,
  // TOTAL_SALES_API,
  // SALES_BY_LOCATION_API,
  // TOP_CUSTOMER_API,
  // GET_SERVICE_TRANSACTIONS_BY_USER,
  // GET_PRODUCT_TRANSACTIONS_BY_USER,
} = userEndpoints;

const { SIGNUP_API } = endpoints;
const { GET_ALL_USER_PROFILE_API } = userProfileEndpoints;

export const createUser = async (token, data) => {
  const toastId = toast.loading("Loading...");
  try {
    // Step 1: Register the user
    const response = await apiConnector(
      "POST",
      SIGNUP_API,
      {
        name: data.email,
        email: data.email,
        password: data.password,
        password_confirmation: data.password,
        role: data.role,
      },
      {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    );

    console.log("Create New User API Response:", response.data.user);
    if (response.status !== 201) throw new Error("Could not create User");

    toast.success("User created successfully");

    // Step 2: Create the user's profile
    const profileResponse = await apiConnector(
      "POST",
      GET_ALL_USER_PROFILE_API,
      {
        user_id: response.data.user.id,
        email: data.email,
        phone_number: data.phone_number,
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        gdpr_sms_active: data.gdpr_sms_active,
        gdpr_email_active: data.gdpr_email_active,
        referred_by: data.referred_by,
        preferred_location: data.preferred_location,
        avatar: data.avatar,
        address: data.address,
        post_code: data.post_code,
        active: true,
      },
      {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    );

    console.log("Create User Profile API Response:", profileResponse);
    if (profileResponse.status !== 201) throw new Error("Could not create User Profile");

    toast.success("User profile created successfully");

    return { user: response.data, profile: profileResponse.data };
  } catch (error) {
    console.log("Create User API Error", error);
    const errorMessage = error.response?.data?.error || "An error occurred";
    toast.error(errorMessage);
  } finally {
    toast.dismiss(toastId);
  }
};

// export const createCustomer = async (token, data) => {
//   const toastId = toast.loading("Loading...");
//   try {
//     const response = await apiConnector("POST", CREATE_CUSTOMER_API, data, {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     });

//     console.log("Create New Customer Api Response..", response);
//     if (response.status !== 201) throw new Error("Could not create User");
//     toast.success("Customer created successfully");
//     return response.data?.data;
//   } catch (error) {
//     console.log("Customer User Api Error", error);
//     const errorMessage = error.response?.data?.message;
//     toast.error(errorMessage);
//   } finally {
//     toast.dismiss(toastId);
//   }
// };

export const getAllUser = async (token) => {
  const toastId = toast.loading("Loading...");
  let result = [];
  try {
    const response = await apiConnector("GET", GET_ALL_USERS, null, {
      Authorization: `Bearer ${token}`,
    });
    console.log("Get All User Api Response..", response);
    if (response.status !== 200) throw new Error("Could not fetch Users");
    result = response.data;
  } catch (error) {
    console.log("Get All User Api Error", error);
    const errorMessage = error.response?.data?.error;
    toast.error(errorMessage);
  } finally {
    toast.dismiss(toastId);
  }
  return result;
};

// export const getUserById = async (token, userId) => {
//   const toastId = toast.loading("Loading...");
//   let result = null;
//   try {
//     const response = await apiConnector("GET", `${USER_API}/${userId}`, null, {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     });
//     console.log("Get User Api Response..", response);
//     if (response.status !== 200) throw new Error("Could not fetch User");
//     toast.success("User fetch successfully");
//     result = response.data?.data;
//   } catch (error) {
//     console.log("Get User Api Error", error);
//     const errorMessage = error.response?.data?.message;
//     toast.error(errorMessage);
//   }
//   toast.dismiss(toastId);
//   return result;
// };

// export const updateUser = async (token, userId, data) => {
//   const toastId = toast.loading("Loading...");
//   let result = null;
//   try {
//     const response = await apiConnector("PATCH", `${USER_API}/${userId}`, data, {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     });
//     console.log("Update User Api Response..", response);
//     if (response.status !== 200) throw new Error("Could not update User");
//     toast.success("User updated successfully");
//     result = response.data?.data;
//   } catch (error) {
//     console.log("Update User Api Error", error);
//     const errorMessage = error.response?.data?.message;
//     toast.error(errorMessage);
//   }
//   toast.dismiss(toastId);
//   return result;
// };

// export const deleteUserAndUserProfile = async (token, userId) => {
//   const toastId = toast.loading("Loading...");
//   let result = null;
//   try {
//     const response = await apiConnector(
//       "DELETE",
//       DELETE_USER_API,
//       { userId: userId },
//       {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       }
//     );
//     console.log("Delete User Api Response..", response);
//     if (response.status !== 204) throw new Error("Could not delete User");
//     toast.success("User deleted successfully");
//     result = true;
//   } catch (error) {
//     console.log("Delete User Api Error...", error);
//     const errorMessage = error.response?.data?.message;
//     toast.error(errorMessage);
//   }
//   toast.dismiss(toastId);
//   return result;
// };

// export const deleteCustomerProfile = async (token, userId) => {
//   const toastId = toast.loading("Loading...");
//   let result = null;
//   try {
//     const response = await apiConnector(
//       "DELETE",
//       DELETE_CUSTOMER_API,
//       { customerId: userId },
//       {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       }
//     );
//     console.log("Delete Customer Api Response..", response);
//     if (response.status !== 204) throw new Error("Could not delete Customer");
//     toast.success("User deleted successfully");
//     result = true;
//   } catch (error) {
//     console.log("Delete Customer Api Error...", error);
//     const errorMessage = error.response?.data?.message;
//     toast.error(errorMessage);
//   }
//   toast.dismiss(toastId);
//   return result;
// };

// export const deleteUser = async (token, userId) => {
//   const toastId = toast.loading("Loading...");
//   let result = null;
//   try {
//     const response = await apiConnector("DELETE", `${USER_API}/${userId}`, null, {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     });
//     console.log("Delete User Api Response..", response);
//     if (response.status !== 204) throw new Error("Could not delete User");
//     toast.success("User deleted successfully");
//     result = true;
//   } catch (error) {
//     console.log("Delete User Api Error...", error);
//     const errorMessage = error.response?.data?.message;
//     toast.error(errorMessage);
//   }
//   toast.dismiss(toastId);
//   return result;
// };

// export const getTotalSales = async (token) => {
//   const toastId = toast.loading("Loading...");
//   let result = [];
//   try {
//     const response = await apiConnector("GET", TOTAL_SALES_API, null, {
//       Authorization: `Bearer ${token}`,
//     });
//     console.log("Get Total Sales Api Response..", response);
//     if (response.status !== 200) throw new Error("Could not fetch Total Sales");
//     // result = [
//     //   ...response.data?.data?.allProductTransaction,
//     //   ...response.data?.data?.allServiceTransaction,
//     // ];
//     result = response.data?.data;
//   } catch (error) {
//     console.log("Get Total Sales Api Error", error);
//     const errorMessage = error.response?.data?.message;
//     toast.error(errorMessage);
//   }
//   toast.dismiss(toastId);
//   return result;
// };

// export const getSalesByLocation = async (token, locationId) => {
//   const toastId = toast.loading("Loading...");
//   let result = null;
//   try {
//     const response = await apiConnector(
//       "POST",
//       SALES_BY_LOCATION_API,
//       { locationId },
//       {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       }
//     );
//     console.log("Sales By Location Api Response..", response);
//     if (response.status !== 200) throw new Error("Could not fetch Sales By Location");
//     toast.success("Sales By Location fetched successfully");
//     result = response.data?.data;
//   } catch (error) {
//     console.log("Sales By Location Api Error", error);
//     const errorMessage = error.response?.data?.message;
//     toast.error(errorMessage);
//   }
//   toast.dismiss(toastId);
//   return result;
// };

// export const getTopCustomer = async (token) => {
//   const toastId = toast.loading("Loading...");
//   let result = [];
//   try {
//     const response = await apiConnector("GET", TOP_CUSTOMER_API, null, {
//       Authorization: `Bearer ${token}`,
//     });
//     console.log("Get All Top Customer Api Response..", response);
//     if (response.status !== 200) throw new Error("Could not fetch Top Customer");
//     result = response.data?.data;
//   } catch (error) {
//     console.log("Get All Top Customer Api Error", error);
//     const errorMessage = error.response?.data?.message;
//     toast.error(errorMessage);
//   }
//   toast.dismiss(toastId);
//   return result;
// };
