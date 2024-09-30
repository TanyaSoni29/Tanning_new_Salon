import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  signupData: null,
  loading: false,
  token: localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null,
  isAuth: false,
  expirationTime: localStorage.getItem("expirationTime")
    ? JSON.parse(localStorage.getItem("expirationTime"))
    : null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setSignupData(state, action) {
      state.signupData = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setToken(state, action) {
      console.log("setToken action:", action);
      state.token = action.payload;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
    setIsAuth(state, action) {
      state.isAuth = action.payload;
    },
  },
});

export const { setSignupData, setToken, setLoading, setUser, setIsAuth } = authSlice.actions;
export default authSlice.reducer;
