import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import handleError from "../helpers/errorHandler";
import addressService from "./addressService";

const initialState = {
  addresses: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// add address
export const addAddressAsync = createAsyncThunk(
  "address/add",
  async (addressData, thunkAPI) => {
    try {
      const accessToken = thunkAPI.getState().auth.user?.accessToken;
      return await addressService.addAddressAsync(addressData, accessToken);
    } catch (err) {
      return handleError(err, thunkAPI, "addAddressAsync", false);
    }
  }
);

// delete address
export const deleteAddressAsync = createAsyncThunk(
  "address/delete",
  async (addressId, thunkAPI) => {
    try {
      const accessToken = thunkAPI.getState().auth.user?.accessToken;
      return await addressService.deleteAddressAsync(addressId, accessToken);
    } catch (err) {
      return handleError(err, thunkAPI, "deleteAddressAsync", false);
    }
  }
);

// update address
export const updateAddressAsync = createAsyncThunk(
  "address/update",
  async ({ addressId, addressData }, thunkAPI) => {
    try {
      const accessToken = thunkAPI.getState().auth.user?.accessToken;
      return await addressService.updateAddressAsync(
        addressId,
        addressData,
        accessToken
      );
    } catch (err) {
      return handleError(err, thunkAPI, "updateAddressAsync", false);
    }
  }
);

// get addresses
export const getAddressesAsync = createAsyncThunk(
  "address/getAll",
  async (_, thunkAPI) => {
    try {
      const accessToken = thunkAPI.getState().auth.user?.accessToken;
      return await addressService.getAddressesAsync(accessToken);
    } catch (err) {
      return handleError(err, thunkAPI, "getAddressesAsync", false);
    }
  }
);

export const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    resetAll: () => initialState,
    resetState: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addAddressAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addAddressAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.addresses = action.payload;
        state.message = "New address has been added successfully.";
      })
      .addCase(addAddressAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAddressesAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAddressesAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addresses = action.payload;
      })
      .addCase(getAddressesAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteAddressAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteAddressAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.addresses = action.payload;
        state.message = "Deleted successfully.";
      })
      .addCase(deleteAddressAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateAddressAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateAddressAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.addresses = action.payload;
        state.message = "Updated successfully.";
      })
      .addCase(updateAddressAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
  },
});

export const { resetState } = addressSlice.actions;
export default addressSlice.reducer;
