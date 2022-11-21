import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import TopNav from "../components/TopNav";

function Layout() {
  return (
    <>
      <TopNav />
      <Outlet />
      <Footer />
    </>
  );
}

export default Layout;
