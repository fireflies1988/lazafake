import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";
import handleError from "../helpers/errorHandler";

// get user info from localStorage
const user = JSON.parse(localStorage.getItem("lazafakeUser"));

const initialState = {
  user: user ?? null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// register
export const registerAsync = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      return await authService.registerAsync(userData);
    } catch (err) {
      return handleError(err, thunkAPI, "registerAsync");
    }
  }
);

// login
export const loginAsync = createAsyncThunk(
  "auth/login",
  async (credentails, thunkAPI) => {
    try {
      return await authService.loginAsync(credentails);
    } catch (err) {
      return handleError(err, thunkAPI, "loginAsync");
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
    logout: (state) => {
      localStorage.removeItem("lazafakeUser");
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, logout } = authSlice.actions;
export default authSlice.reducer;
