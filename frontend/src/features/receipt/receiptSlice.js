import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import handleError from "../helpers/errorHandler";
import receiptService from "./receiptService";

const initialState = {
  receipts: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// add receipt
export const addReceiptAsync = createAsyncThunk(
  "receipt/add",
  async ({ products }, thunkAPI) => {
    try {
      const accessToken = thunkAPI.getState().auth.user?.accessToken;
      return await receiptService.addReceiptAsync({ products }, accessToken);
    } catch (err) {
      return handleError(err, thunkAPI, "addReceiptAsync", false);
    }
  }
);

// get receipts
export const getReceiptsAsync = createAsyncThunk(
  "receipt/get",
  async (_, thunkAPI) => {
    try {
      const accessToken = thunkAPI.getState().auth.user?.accessToken;
      return await receiptService.getReceiptsAsync(accessToken);
    } catch (err) {
      return handleError(err, thunkAPI, "getReceiptsAsync", false);
    }
  }
);

export const receiptSlice = createSlice({
  name: "receipt",
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
      .addCase(addReceiptAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addReceiptAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.receipts.push({
          ...action.payload,
        });
        state.message = "Saved Successfully.";
      })
      .addCase(addReceiptAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getReceiptsAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getReceiptsAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.receipts = action.payload;
      })
      .addCase(getReceiptsAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = receiptSlice.actions;
export default receiptSlice.reducer;
