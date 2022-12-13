import React from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import AdminLayout from "./pages/admin/AdminLayout";
import Categories from "./pages/admin/Categories";
import Dashboard from "./pages/admin/Dashboard";
import Orders from "./pages/admin/Orders";
import PriceChanges from "./pages/admin/PriceChanges";
import Products from "./pages/admin/Products";
import Promotions from "./pages/admin/Promotions";
import Users from "./pages/admin/Users";
import WarehouseReceipts from "./pages/admin/WarehouseReceipts";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Login from "./pages/Login";
import ProductDetails from "./pages/ProductDetails";
import Register from "./pages/Register";
import ResultPage from "./pages/ResultPage";
import SearchPage from "./pages/SearchPage";
import AddressBook from "./pages/user/account/AddressBook";
import Password from "./pages/user/account/Password";
import Profile from "./pages/user/account/Profile";
import VerifyEmail from "./pages/user/account/VerifyEmail";
import MyOrders from "./pages/user/MyOrders";
import Notifications from "./pages/user/Notifications";
import UserLayout from "./pages/user/UserLayout";
import Vouchers from "./pages/user/Vouchers";

function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          {!user && (
            <>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </>
          )}
          <Route index element={<Home />} />
          {user && (
            <>
              <Route path="user" element={<UserLayout />}>
                <Route index element={<Navigate to="account/profile" />} />

                <Route path="account">
                  <Route index element={<Navigate to="profile" />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="address-book" element={<AddressBook />} />
                  <Route path="password" element={<Password />} />
                  <Route path="verify" element={<VerifyEmail />} />
                  <Route path="*" element={<Navigate to="profile" />} />
                </Route>

                <Route path="orders" element={<MyOrders />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="vouchers" element={<Vouchers />} />

                <Route path="*" element={<Navigate to="account/profile" />} />
              </Route>
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
            </>
          )}

          <Route path="products/:productId" element={<ProductDetails />} />
          <Route path="result" element={<ResultPage />} />
          <Route path="search" element={<SearchPage />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Route>

        {(user?.role === "admin" || user?.role === "spadmin") && (
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="categories" element={<Categories />} />
            <Route path="users" element={<Users />} />
            <Route path="receipts" element={<WarehouseReceipts />} />
            <Route path="price-history" element={<PriceChanges />} />
            <Route path="products" element={<Products />} />
            <Route path="promotions" element={<Promotions />} />
            <Route path="orders" element={<Orders />} />
            <Route path="*" element={<Navigate to="dashboard" />} />
          </Route>
        )}

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
