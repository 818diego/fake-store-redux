import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";


const initialState = {
  isAuthenticated: false,
  username: "",
  userId: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const token = action.payload;
      const decodedToken = jwtDecode(token);
      state.isAuthenticated = true;
      state.username = decodedToken.username;
      state.userId = decodedToken.userId;
      state.token = token;
      localStorage.setItem("token", token);
      console.log("Login successful", decodedToken);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.username = "";
      state.userId = null;
      state.token = null;
      localStorage.removeItem("token");
    },
    checkAuth: (state) => {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = jwtDecode(token);
        state.isAuthenticated = true;
        state.username = decodedToken.username;
        state.userId = decodedToken.userId;
        state.token = token;
      }
    },
  },
});

export const { login, logout, checkAuth } = authSlice.actions;
export default authSlice.reducer;
