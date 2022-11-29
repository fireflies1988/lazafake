import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import handleError from "../helpers/errorHandler";
import cartService from "./cartService";

const initialState = {
  cartItems: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// view cart
export const getCartItems = createAsyncThunk(
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
  async ({ productId, quantity }, thunkAPI) => {
    try {
      const accessToken = thunkAPI.getState().auth.user?.accessToken;
      return await cartService.addToCartAsync(productId, quantity, accessToken);
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

// remove from cart
// items: list of item ids
export const removeMultipleFromCartAsync = createAsyncThunk(
  "cart/remove-multiple",
  async (items, thunkAPI) => {
    try {
      const accessToken = thunkAPI.getState().auth.user?.accessToken;
      return await cartService.removeMultipleFromCartAsync(items, accessToken);
    } catch (err) {
      return handleError(err, thunkAPI, "removeMultipleFromCartAsync", false);
    }
  }
);

// change quantity
export const changeQtyAsync = createAsyncThunk(
  "cart/changeQty",
  async ({ cartItemId, quantity }, thunkAPI) => {
    try {
      const accessToken = thunkAPI.getState().auth.user?.accessToken;
      return await cartService.changeQtyAsync(
        cartItemId,
        quantity,
        accessToken
      );
    } catch (err) {
      return handleError(err, thunkAPI, "changeQtyAsync", false);
    }
  }
);

// check out 
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
        state.cartItems.push(action.payload);
        state.message = "This item has been added to your cart.";
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload;
      })
      .addCase(getCartItems.rejected, (state, action) => {
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
        state.cartItems = state.cartItems.filter(
          (item) => item._id !== action.payload._id
        );
        state.message = "Removed from your cart.";
      })
      .addCase(removeFromCartAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(removeMultipleFromCartAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeMultipleFromCartAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.cartItems = action.payload;
        state.message = "Removed selected items.";
      })
      .addCase(removeMultipleFromCartAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(changeQtyAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(changeQtyAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        let index = state.cartItems.findIndex(
          (item) => item._id === action.payload._id
        );
        state.cartItems[index] = action.payload;
      })
      .addCase(changeQtyAsync.rejected, (state, action) => {
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
        state.cartItems = action.payload;
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
