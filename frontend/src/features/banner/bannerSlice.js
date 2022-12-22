import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import handleError from "../helpers/errorHandler";
import bannerService from "./bannerService";

const initialState = {
  banners: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// update banners (admin)
export const updateBannersAsync = createAsyncThunk(
  "banners/update",
  async ({ formData }, thunkAPI) => {
    try {
      const accessToken = thunkAPI.getState().auth.user?.accessToken;
      return await bannerService.updateBannersAsync(formData, accessToken);
    } catch (err) {
      return handleError(err, thunkAPI, "updateBannersAsync", false);
    }
  }
);

// get banners (admin)
export const getBannersAsync = createAsyncThunk(
  "banners/get",
  async (_, thunkAPI) => {
    try {
      return await bannerService.getBannersAsync();
    } catch (err) {
      return handleError(err, thunkAPI, "getBannersAsync", false);
    }
  }
);

export const bannerSlice = createSlice({
  name: "banner",
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
      .addCase(updateBannersAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateBannersAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.banners = action.payload;
        state.message = "Updated successfully.";
      })
      .addCase(updateBannersAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getBannersAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBannersAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.banners = action.payload;
      })
      .addCase(getBannersAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = bannerSlice.actions;
export default bannerSlice.reducer;
