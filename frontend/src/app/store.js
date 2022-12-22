import { configureStore } from "@reduxjs/toolkit";
import addressReducer from "../features/address/addressSlice";
import authReducer from "../features/auth/authSlice";
import categoryReducer from "../features/category/categorySlice";
import productReducer from "../features/product/productSlice";
import cartReducer from "../features/cart/cartSlice";
import orderReducer from "../features/order/orderSlice";
import reviewReducer from "../features/review/reviewSlice";
import receiptReducer from "../features/receipt/receiptSlice";
import priceHistoryReducer from "../features/priceHistory/priceHistorySlice";
import promotionReducer from "../features/promotion/promotionSlice";
import bannerReducer from "../features/banner/bannerSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    address: addressReducer,
    category: categoryReducer,
    product: productReducer,
    cart: cartReducer,
    order: orderReducer,
    review: reviewReducer,
    receipt: receiptReducer,
    priceHistory: priceHistoryReducer,
    promotion: promotionReducer,
    banner: bannerReducer,
  },
});
