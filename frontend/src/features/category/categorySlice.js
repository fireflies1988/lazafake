import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import handleError from "../helpers/errorHandler";
import categoryService from "./categoryService";

const initialState = {
  categories: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// add category
export const addCategoryAsync = createAsyncThunk(
  "address/add",
  async (formData, thunkAPI) => {
    try {
      const accessToken = thunkAPI.getState().auth.user?.accessToken;
      return await categoryService.addCategoryAsync(formData, accessToken);
    } catch (err) {
      return handleError(err, thunkAPI, "addCategoryAsync", false);
    }
  }
);

// get categories
export const getCategoriesAsync = createAsyncThunk(
  "category/getAll",
  async (_, thunkAPI) => {
    try {
      return await categoryService.getCategoriesAsync();
    } catch (err) {
      return handleError(err, thunkAPI, "getCategoriesAsync", false);
    }
  }
);

// delete category
export const deleteCategoryAsync = createAsyncThunk(
  "category/delete",
  async (categoryId, thunkAPI) => {
    try {
      const accessToken = thunkAPI.getState().auth.user?.accessToken;
      return await categoryService.deleteCategoryAsync(categoryId, accessToken);
    } catch (err) {
      return handleError(err, thunkAPI, "deleteCategoryAsync", false);
    }
  }
);

// update category
export const updateCategoryAsync = createAsyncThunk(
  "category/update",
  async ({ categoryId, formData }, thunkAPI) => {
    try {
      const accessToken = thunkAPI.getState().auth.user?.accessToken;
      return await categoryService.updateCategoryAsync(
        categoryId,
        formData,
        accessToken
      );
    } catch (err) {
      return handleError(err, thunkAPI, "updateCategoryAsync", false);
    }
  }
);

export const addressSlice = createSlice({
  name: "category",
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
      .addCase(addCategoryAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addCategoryAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.categories = action.payload;
        state.message = "New category has been added successfully.";
      })
      .addCase(addCategoryAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getCategoriesAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCategoriesAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(getCategoriesAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteCategoryAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCategoryAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.categories = action.payload;
        state.message = "Deleted successfully.";
      })
      .addCase(deleteCategoryAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateCategoryAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCategoryAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.categories = action.payload;
        state.message = "Updated successfully.";
      })
      .addCase(updateCategoryAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = addressSlice.actions;
export default addressSlice.reducer;
