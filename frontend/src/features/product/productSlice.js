import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import handleError from "../helpers/errorHandler";
import productService from "./productService";

const initialState = {
  products: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// add product (admin)
export const addProductAsync = createAsyncThunk(
  "product/add",
  async (formData, thunkAPI) => {
    try {
      const accessToken = thunkAPI.getState().auth.user?.accessToken;
      return await productService.addProductAsync(formData, accessToken);
    } catch (err) {
      return handleError(err, thunkAPI, "addProductAsync", false);
    }
  }
);

// get categories
export const getProductsAsync = createAsyncThunk(
  "product/getAll",
  async (queryParams, thunkAPI) => {
    try {
      return await productService.getProductsAsync(queryParams);
    } catch (err) {
      return handleError(err, thunkAPI, "getProductsAsync", false);
    }
  }
);

// delete product (admin)
export const deleteProductAsync = createAsyncThunk(
  "product/delete",
  async (productId, thunkAPI) => {
    try {
      const accessToken = thunkAPI.getState().auth.user?.accessToken;
      return await productService.deleteProductAsync(productId, accessToken);
    } catch (err) {
      return handleError(err, thunkAPI, "deleteProductAsync", false);
    }
  }
);

// update product (admin)
export const updateProductAsync = createAsyncThunk(
  "product/update",
  async ({ productId, formData }, thunkAPI) => {
    try {
      const accessToken = thunkAPI.getState().auth.user?.accessToken;
      return await productService.updateProductAsync(
        productId,
        formData,
        accessToken
      );
    } catch (err) {
      return handleError(err, thunkAPI, "updateProductAsync", false);
    }
  }
);

export const productSlice = createSlice({
  name: "product",
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
      .addCase(addProductAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addProductAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.products.push(action.payload);
        state.message = "New product has been added successfully.";
      })
      .addCase(addProductAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getProductsAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProductsAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
      })
      .addCase(getProductsAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteProductAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteProductAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.products = state.products.filter(
          (p) => p._id !== action.payload._id
        );
        state.message = "Deleted successfully.";
      })
      .addCase(deleteProductAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateProductAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProductAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        let index = state.products.findIndex(
          (p) => p._id === action.payload._id
        );
        state.products[index] = action.payload;
        state.message = "Updated successfully.";
      })
      .addCase(updateProductAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = productSlice.actions;
export default productSlice.reducer;
