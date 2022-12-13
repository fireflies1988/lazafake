import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import handleError from "../helpers/errorHandler";
import priceHistoryService from "./priceHistoryService";

const initialState = {
  priceChanges: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// get receipts
export const getPriceHistoryAsync = createAsyncThunk(
  "priceHistory/get",
  async (_, thunkAPI) => {
    try {
      const accessToken = thunkAPI.getState().auth.user?.accessToken;
      return await priceHistoryService.getPriceHistoryAsync(accessToken);
    } catch (err) {
      return handleError(err, thunkAPI, "getPriceHistoryAsync", false);
    }
  }
);

export const priceHistorySlice = createSlice({
  name: "priceHistory",
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
      .addCase(getPriceHistoryAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPriceHistoryAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.priceChanges = action.payload;
      })
      .addCase(getPriceHistoryAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = priceHistorySlice.actions;
export default priceHistorySlice.reducer;
