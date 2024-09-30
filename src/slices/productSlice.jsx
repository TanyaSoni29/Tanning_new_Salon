import { createSlice } from "@reduxjs/toolkit";
import { getAllProducts } from "service/operations/productAndProductTransaction";

const initialState = {
  products: [],
  productIndex: null,
  loading: false,
};

const productSlice = createSlice({
  name: "product",
  initialState: initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setProducts: (state, action) => {
      state.products = action.payload;
      state.loading = false;
    },
    setProductIndex: (state, action) => {
      state.productIndex = action.payload;
      state.loading = false;
    },
    addProduct: (state, action) => {
      state.products.push(action.payload);
      state.loading = false;
    },
    updateProduct: (state, action) => {
      const index = state.products.findIndex((product) => product.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
      state.loading = false;
    },
    removeProduct: (state, action) => {
      state.products = state.products.filter((product) => product.id !== action.payload);
      state.loading = false;
    },
  },
});

export function refreshProduct() {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    try {
      const response = await getAllProducts(token);
      dispatch(setProducts(response));
    } catch (error) {
      console.error("Failed to refresh products:", error);
    }
  };
}

export const {
  setLoading,
  setProducts,
  setProductIndex,
  addProduct,
  updateProduct,
  removeProduct,
} = productSlice.actions;
export default productSlice.reducer;
