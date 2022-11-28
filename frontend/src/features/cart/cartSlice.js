import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import handleError from "../helpers/errorHandler";
import cartService from "./cartService";

const initialState = {
  cart: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// view cart
export const viewCartAsync = createAsyncThunk(
  "cart/view",
  async (_, thunkAPI) => {
    try {
      const accessToken = thunkAPI.getState().auth.user?.accessToken;
      return await cartService.viewCartAsync(accessToken);
    } catch (err) {
      return handleError(err, thunkAPI, "viewCartAsync", false);
    }
  }
);

// add to cart
export const addToCartAsync = createAsyncThunk(
  "cart/add",
  async (productId, thunkAPI) => {
    try {
      const accessToken = thunkAPI.getState().auth.user?.accessToken;
      return await cartService.addToCartAsync(productId, accessToken);
    } catch (err) {
      return handleError(err, thunkAPI, "addToCartAsync", false);
    }
  }
);

// remove from cart
export const removeFromCartAsync = createAsyncThunk(
  "cart/remove",
  async (cartItemId, thunkAPI) => {
    try {
      const accessToken = thunkAPI.getState().auth.user?.accessToken;
      return await cartService.removeFromCartAsync(cartItemId, accessToken);
    } catch (err) {
      return handleError(err, thunkAPI, "removeFromCartAsync", false);
    }
  }
);

// change quantity
export const changeQuantityAsync = createAsyncThunk(
  "cart/changeQty",
  async ({ cartItemId, increase }, thunkAPI) => {
    try {
      const accessToken = thunkAPI.getState().auth.user?.accessToken;
      return await cartService.changeQuantityAsync(
        cartItemId,
        increase,
        accessToken
      );
    } catch (err) {
      return handleError(err, thunkAPI, "changeQuantityAsync", false);
    }
  }
);

export const checkoutAsync = createAsyncThunk(
  "cart/checkout",
  async (cartItems, thunkAPI) => {
    try {
      const accessToken = thunkAPI.getState().auth.user?.accessToken;
      return await cartService.checkoutAsync(cartItems, accessToken);
    } catch (err) {
      return handleError(err, thunkAPI, "checkoutAsync", false);
    }
  }
);

export const cartSlice = createSlice({
  name: "cart",
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
      .addCase(addToCartAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.cart = action.payload;
        state.message = "This item has been added to your cart.";
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(viewCartAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(viewCartAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload;
      })
      .addCase(viewCartAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(removeFromCartAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.cart = action.payload;
        state.message = "Removed from your cart.";
      })
      .addCase(removeFromCartAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(changeQuantityAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(changeQuantityAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.cart = action.payload;
        state.message = "Updated successfully.";
      })
      .addCase(changeQuantityAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(checkoutAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkoutAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.cart = action.payload;
        state.message = "Updated successfully.";
      })
      .addCase(checkoutAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = cartSlice.actions;
export default cartSlice.reducer;
