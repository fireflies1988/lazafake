import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import TopNav from "../components/TopNav";
import Content from "../components/Content";

function Layout() {
  return (
    <>
      <TopNav />
      <Content>
        <Outlet />
      </Content>
      <Footer />
    </>
  );
}

export default Layout;
