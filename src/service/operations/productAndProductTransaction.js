import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { productEndpoints } from "../api";
import { setLoading } from "../../slices/productSlice";

const { GET_ALL_PRODUCT_API, GET_ALL_PRODUCT_TRANSACTION_API } = productEndpoints;

export const createProduct = async (token, data) => {
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("POST", GET_ALL_PRODUCT_API, data, {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    });

    console.log("Create New Product Api Response..", response);
    if (response.status !== 201) throw new Error("Could not create Product");
    toast.success("Product created successfully");
    return response.data;
  } catch (error) {
    console.log("Create Product Api Error", error);
    const errorMessage = error?.response?.data?.error;
    toast.error(errorMessage);
  } finally {
    toast.dismiss(toastId);
  }
};

export const getAllProducts = async (token) => {
  const toastId = toast.loading("Loading...");
  let result = [];
  try {
    const response = await apiConnector("GET", GET_ALL_PRODUCT_API, null, {
      Authorization: `Bearer ${token}`,
    });
    console.log("Get All Product Api Response..", response);
    if (response.status !== 200) throw new Error("Could not fetch all Product");
    result = response.data;
  } catch (error) {
    console.log("Get All Product Api Error", error);
    const errorMessage = error.response?.data?.error;
    toast.error(errorMessage);
  }
  toast.dismiss(toastId);
  return result;
};

export const updateProduct = async (token, productId, data) => {
  const toastId = toast.loading("Loading...");
  let result = null;
  try {
    const response = await apiConnector("PUT", `${GET_ALL_PRODUCT_API}/${productId}`, data, {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    });
    console.log("Update Product Api Response..", response);
    if (response.status !== 200) throw new Error("Could not update Product");
    toast.success("Product updated successfully");
    result = response.data;
  } catch (error) {
    console.log("Update Product Api Error", error);
    const errorMessage = error.response?.data?.error;
    toast.error(errorMessage);
  }
  toast.dismiss(toastId);
  return result;
};

export const getProduct = async (token, productId) => {
  const toastId = toast.loading("Loading...");
  let result = null;
  try {
    const response = await apiConnector("GET", `${GET_ALL_PRODUCT_API}/${productId}`, null, {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    });

    console.log("Get Product Api Response..", response);
    if (response.status !== 200) throw new Error("Could not fetch Product");
    toast.success("Product fetched successfully");
    result = response.data;
  } catch (error) {
    console.log("Get Product Api Error", error);
    const errorMessage = error.response?.data?.error;
    toast.error(errorMessage);
  }
  toast.dismiss(toastId);
  return result;
};

export const deleteProduct = async (token, productId) => {
  const toastId = toast.loading("Loading...");
  let result = false;
  try {
    const response = await apiConnector(
      "DELETE",
      `${GET_ALL_PRODUCT_API}/${productId}`,
      undefined,
      {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    );
    console.log("Delete Product Api Response..", response);
    if (response.status !== 200) throw new Error("Could not delete Product");
    toast.success("Product deleted successfully");
    result = true;
  } catch (error) {
    console.log("Delete Product Api Error", error);
    const errorMessage = error.response?.data?.error;
    toast.error(errorMessage);
  }
  toast.dismiss(toastId);
  return result;
};

export const createProductTransaction = async (token, data) => {
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("POST", GET_ALL_PRODUCT_TRANSACTION_API, data, {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    });

    console.log("Create New Product Transaction Api Response..", response);
    if (response.status !== 201) throw new Error("Could not create Product");
    toast.success("Product Transaction created successfully");
    return response.data;
  } catch (error) {
    console.log("Create Product Transaction Api Error", error);
    const errorMessage = error.response?.data?.error;
    toast.error(errorMessage);
  } finally {
    toast.dismiss(toastId);
  }
};

export const getAllProductTransactions = async (token) => {
  const toastId = toast.loading("Loading...");
  let result = null;
  try {
    const response = await apiConnector("GET", GET_ALL_PRODUCT_TRANSACTION_API, null, {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    });
    if (response.status !== 200) throw new Error("Could not fetch All Product Transaction");
    // toast.success("All Product Transactions fetched successfully");
    result = response.data;
  } catch (error) {
    console.log("Fetch product transactions api error", error);
    const errorMessage = error.response?.data?.error;
    toast.error(errorMessage);
  }
  toast.dismiss(toastId);
  return result;
};

export const getProductTransactionsByUser = async (token, userId) => {
  const toastId = toast.loading("Loading...");
  let result = null;
  try {
    const response = await apiConnector(
      "GET",
      `${GET_ALL_PRODUCT_TRANSACTION_API}/${userId}`,
      null,
      {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    );
    console.log("Get User Product transactions Api Response..", response);
    if (response.status !== 200) throw new Error("Could not fetch User transactions");
    // toast.success("User Transactions fetch successfully");
    result = response.data;
  } catch (error) {
    console.log("Get User Product transactions Api Error", error);
    const errorMessage = error?.response?.data?.error;
    toast.error(errorMessage);
  }
  toast.dismiss(toastId);
  return result;
};
