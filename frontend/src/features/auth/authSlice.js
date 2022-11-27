import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";
import handleError from "../helpers/errorHandler";

// get user info from localStorage
const user = JSON.parse(localStorage.getItem("lazafakeUser"));
function saveUser(data) {
  localStorage.setItem("lazafakeUser", JSON.stringify(data));
}

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

// update profile
export const updateProfileAsync = createAsyncThunk(
  "auth/update",
  async (formData, thunkAPI) => {
    try {
      const accessToken = thunkAPI.getState().auth.user?.accessToken;
      return await authService.updateProfileAsync(formData, accessToken);
    } catch (err) {
      return handleError(err, thunkAPI, "updateProfileAsync", true);
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
        saveUser(action.payload);
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateProfileAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfileAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = "Your profile has been successfully updated."
        state.user = { ...state.user, ...action.payload };
        saveUser(state.user);
      })
      .addCase(updateProfileAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, logout } = authSlice.actions;
export default authSlice.reducer;
