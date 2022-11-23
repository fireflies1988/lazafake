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
import Orders from "./pages/user/Orders";
import Vouchers from "./pages/user/Vouchers";

function App() {
  const isLoggedIn = true;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {!isLoggedIn && (
            <>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </>
          )}
          <Route index element={<Home />} />
          {isLoggedIn && (
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

                <Route path="orders" element={<Orders />} />
                <Route path="vouchers" element={<Vouchers />} />

                <Route path="*" element={<Navigate to="account/profile" />} />
              </Route>
              <Route path="cart" element={<Cart />} />
            </>
          )}

          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
