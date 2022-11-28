import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import handleError from "../helpers/errorHandler";
import orderService from "./orderService";

const initialState = {
  orders: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// place order
export const placeOrderAsync = createAsyncThunk(
  "order/place",
  async (orderData, thunkAPI) => {
    try {
      const accessToken = thunkAPI.getState().auth.user?.accessToken;
      return await orderService.placeOrderAsync(orderData, accessToken);
    } catch (err) {
      return handleError(err, thunkAPI, "placeOrderAsync", false);
    }
  }
);

export const orderSlice = createSlice({
  name: "order",
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
      .addCase(placeOrderAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(placeOrderAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = "Your order has been placed.";
      })
      .addCase(placeOrderAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = orderSlice.actions;
export default orderSlice.reducer;
