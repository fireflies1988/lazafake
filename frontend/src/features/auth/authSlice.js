import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";

// get user info from localStorage
const user = JSON.parse(localStorage.getItem("user"));

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
  async (user, thunkAPI) => {
    try {
      return await authService.registerAsync(user);
    } catch (err) {
      console.log("registerAsync", err);
      const message =
        err?.response?.data?.errors?.map((err) => err.msg) ??
        err?.response?.data?.message ??
        err?.message ??
        err.toString();
      return thunkAPI.rejectWithValue(message);
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = "Your account has been created. Login now.";
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

console.log("authSlice", authSlice);

export const { reset } = authSlice.actions;
export default authSlice.reducer;
