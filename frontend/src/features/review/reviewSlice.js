import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import handleError from "../helpers/errorHandler";
import reviewService from "./reviewService";

const initialState = {
  reviews: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// write a review
export const addReviewAsync = createAsyncThunk(
  "review/add",
  async ({ orderId, productId, rating, comment }, thunkAPI) => {
    try {
      const accessToken = thunkAPI.getState().auth.user?.accessToken;
      return await reviewService.addReviewAsync(
        { orderId, productId, rating, comment },
        accessToken
      );
    } catch (err) {
      return handleError(err, thunkAPI, "addReviewAsync", false);
    }
  }
);

// edit review
export const editReviewAsync = createAsyncThunk(
  "review/edit",
  async ({ reviewId, rating, comment }, thunkAPI) => {
    try {
      const accessToken = thunkAPI.getState().auth.user?.accessToken;
      return await reviewService.editReviewAsync(
        { reviewId, rating, comment },
        accessToken
      );
    } catch (err) {
      return handleError(err, thunkAPI, "editReviewAsync", false);
    }
  }
);

// get reviews
export const getReviewsAsync = createAsyncThunk(
  "review/get",
  async (params, thunkAPI) => {
    try {
      return await reviewService.getReviewsAsync(params);
    } catch (err) {
      return handleError(err, thunkAPI, "getReviewsAsync", false);
    }
  }
);

export const reviewSlice = createSlice({
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
      .addCase(addReviewAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addReviewAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.reviews.push(action.payload);
        state.message = "Thank your for your review.";
      })
      .addCase(addReviewAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(editReviewAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editReviewAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.reviews.findIndex(
          (r) => r._id === action.payload._id
        );
        state.reviews[index] = action.payload;
        state.message = "Edited Successfully.";
      })
      .addCase(editReviewAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getReviewsAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getReviewsAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        // state.isSuccess = true;
        state.reviews = action.payload;
      })
      .addCase(getReviewsAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = reviewSlice.actions;
export default reviewSlice.reducer;
