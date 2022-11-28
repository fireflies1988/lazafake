import { configureStore } from "@reduxjs/toolkit";
import addressReducer from "../features/address/addressSlice";
import authReducer from "../features/auth/authSlice";
import categoryReducer from "../features/category/categorySlice";
import productReducer from "../features/product/productSlice";
import cartReducer from "../features/cart/cartSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    address: addressReducer,
    category: categoryReducer,
    product: productReducer,
    cart: cartReducer,
  },
});
