import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import handleError from "../helpers/errorHandler";
import promotionService from "./promotionService";

const initialState = {
  promotions: [],
  segmented: "",
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// add promotion
export const addPromotionAsync = createAsyncThunk(
  "promotion/add",
  async ({ name, note, to, from, products }, thunkAPI) => {
    try {
      const accessToken = thunkAPI.getState().auth.user?.accessToken;
      return await promotionService.addPromotionAsync(
        { name, note, to, from, products },
        accessToken
      );
    } catch (err) {
      return handleError(err, thunkAPI, "addPromotionAsync", false);
    }
  }
);

// edit promotion
export const editPromotionAsync = createAsyncThunk(
  "promotion/edit",
  async ({ promotionId, name, note, to, from, products }, thunkAPI) => {
    try {
      const accessToken = thunkAPI.getState().auth.user?.accessToken;
      return await promotionService.editPromotionAsync(
        { promotionId, name, note, to, from, products },
        accessToken
      );
    } catch (err) {
      return handleError(err, thunkAPI, "editPromotionAsync", false);
    }
  }
);

// get promotions
export const getPromotionsAsync = createAsyncThunk(
  "promotion/get",
  async (params, thunkAPI) => {
    try {
      const accessToken = thunkAPI.getState().auth.user?.accessToken;
      return await promotionService.getPromotionsAsync(params, accessToken);
    } catch (err) {
      return handleError(err, thunkAPI, "getPromotionsAsync", false);
    }
  }
);

// delete not-started promotion
export const deletePromotionAsync = createAsyncThunk(
  "promotion/delete",
  async (promotionId, thunkAPI) => {
    try {
      const accessToken = thunkAPI.getState().auth.user?.accessToken;
      return await promotionService.deletePromotionAsync(
        promotionId,
        accessToken
      );
    } catch (err) {
      return handleError(err, thunkAPI, "deletePromotionAsync", false);
    }
  }
);

export const promotionSlice = createSlice({
  name: "promotion",
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
      .addCase(addPromotionAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addPromotionAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        if (state.segmented === "Not Started") {
          state.promotions.push({
            ...action.payload,
          });
        }
        state.message = "Saved Successfully.";
      })
      .addCase(addPromotionAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(editPromotionAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editPromotionAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        if (state.segmented === "Not Started") {
          const index = state.promotions.findIndex(
            (p) => p._id === action.payload._id
          );
          state.promotions[index] = action.payload;
        }
        state.message = "Updated Successfully.";
      })
      .addCase(editPromotionAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getPromotionsAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPromotionsAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.promotions = action.payload;
      })
      .addCase(getPromotionsAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deletePromotionAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletePromotionAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.promotions = state.promotions.filter(
          (p) => p._id !== action.payload._id
        );
        state.message = "Deleted successfully.";
      })
      .addCase(deletePromotionAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, changeSegmented } = promotionSlice.actions;
export default promotionSlice.reducer;
