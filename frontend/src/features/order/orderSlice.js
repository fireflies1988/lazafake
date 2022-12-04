import {
  createSlice,
  createAsyncThunk,
  TaskAbortError,
} from "@reduxjs/toolkit";
import handleError from "../helpers/errorHandler";
import orderService from "./orderService";

const initialState = {
  orders: [],
  paypalUrl: "",
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

// get all order (admin)
export const getAllOrdersAsync = createAsyncThunk(
  "order/getAll",
  async (_, thunkAPI) => {
    try {
      const accessToken = thunkAPI.getState().auth.user?.accessToken;
      return await orderService.getAllOrdersAsync(accessToken);
    } catch (err) {
      return handleError(err, thunkAPI, "getAllOrdersAsync", false);
    }
  }
);

// update order status (admin)
export const updateOrderStatusAsync = createAsyncThunk(
  "order/update",
  async ({ orderId, status }, thunkAPI) => {
    try {
      const accessToken = thunkAPI.getState().auth.user?.accessToken;
      return await orderService.updateOrderStatusAsync(
        orderId,
        status,
        accessToken
      );
    } catch (err) {
      return handleError(err, thunkAPI, "updateOrderStatusAsync", false);
    }
  }
);

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    reset: (state) => {
      state.paypalUrl = "";
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
        state.paypalUrl = action.payload;
        state.message = "Your order has been placed successfully.";
      })
      .addCase(placeOrderAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAllOrdersAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        // state.isSuccess = true;
        state.orders = action.payload;
      })
      .addCase(getAllOrdersAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateOrderStatusAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateOrderStatusAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.orders.findIndex(
          (order) => order._id === action.payload._id
        );
        state.orders[index] = action.payload;
        state.message = "Updated order successfully.";
      })
      .addCase(updateOrderStatusAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = orderSlice.actions;
export default orderSlice.reducer;
