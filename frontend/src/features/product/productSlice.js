import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import handleError from "../helpers/errorHandler";
import productService from "./productService";

const initialState = {
  products: [],
  brands: [],
  segmented: "",
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

// list product (admin)
export const listProductAsync = createAsyncThunk(
  "product/list",
  async ({ productId, price }, thunkAPI) => {
    try {
      const accessToken = thunkAPI.getState().auth.user?.accessToken;
      return await productService.listProductAsync(
        { productId, price },
        accessToken
      );
    } catch (err) {
      return handleError(err, thunkAPI, "listProductAsync", false);
    }
  }
);

// change price (admin)
export const changeProductPriceAsync = createAsyncThunk(
  "product/change-price",
  async ({ productId, newPrice }, thunkAPI) => {
    try {
      const accessToken = thunkAPI.getState().auth.user?.accessToken;
      return await productService.changeProductPriceAsync(
        { productId, newPrice },
        accessToken
      );
    } catch (err) {
      return handleError(err, thunkAPI, "changeProductPriceAsync", false);
    }
  }
);

// get products
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

// get brands
export const getBrandsAsync = createAsyncThunk(
  "product/brands",
  async (_, thunkAPI) => {
    try {
      return await productService.getBrandsAsync();
    } catch (err) {
      return handleError(err, thunkAPI, "getBrandsAsync", false);
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
    changeSegmented: (state, action) => {
      state.segmented = action.payload;
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
        if (state.segmented === "Unlisted") {
          state.products.push({
            ...action.payload,
            mostRecentSale: {
              label: "None",
              value: Number.MAX_VALUE,
            },
          });
        }
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
      .addCase(getBrandsAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBrandsAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.brands = action.payload;
      })
      .addCase(getBrandsAsync.rejected, (state, action) => {
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
        const mostRecentSale = state.products[index]?.mostRecentSale;
        state.products[index] = { ...action.payload, mostRecentSale };
        state.message = "Updated successfully.";
      })
      .addCase(updateProductAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(listProductAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(listProductAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.products = state.products.filter(
          (p) => p._id !== action.payload._id
        );
        state.message = "Listed product successfully.";
      })
      .addCase(listProductAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(changeProductPriceAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(changeProductPriceAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        let index = state.products.findIndex(
          (p) => p._id === action.payload._id
        );
        const mostRecentSale = state.products[index]?.mostRecentSale;
        state.products[index] = { ...action.payload, mostRecentSale };
        state.message = "Changed product price successfully.";
      })
      .addCase(changeProductPriceAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, changeSegmented } = productSlice.actions;
export default productSlice.reducer;
