import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Cart from "./pages/Cart";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserLayout from "./pages/user/UserLayout";
import Profile from "./pages/user/account/Profile";
import AddressBook from "./pages/user/account/AddressBook";
import Password from "./pages/user/account/Password";
import MyOrders from "./pages/user/MyOrders";
import Vouchers from "./pages/user/Vouchers";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Categories from "./pages/admin/Categories";
import Products from "./pages/admin/Products";
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./pages/Checkout";
import SearchPage from "./pages/SearchPage";
import Orders from "./pages/admin/Orders";
import { useSelector } from "react-redux";

function App() {
  const { user } = useSelector((state) => state.auth);
  const isAdmin = true;

  return (
    <BrowserRouter>
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
                  <Route path="*" element={<Navigate to="profile" />} />
                </Route>

                <Route path="orders" element={<MyOrders />} />
                <Route path="vouchers" element={<Vouchers />} />

                <Route path="*" element={<Navigate to="account/profile" />} />
              </Route>
              <Route path="cart" element={<Cart />} />
            </>
          )}

          <Route path="products/:id" element={<ProductDetails />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="search" element={<SearchPage />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Route>

        {user?.role === "admin" && (
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="categories" element={<Categories />} />
            <Route path="products" element={<Products />} />
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
