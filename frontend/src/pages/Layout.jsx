import React from "react";
import { Link, Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import TopNav from "../components/TopNav";
import Content from "../components/Content";
import { Alert } from "antd";
import Container from "../components/Container";
import { useSelector } from "react-redux";

function Layout() {
  const { user } = useSelector((state) => state.auth);

  return (
    <>
      <TopNav />
      {user && !user.verified && (
        <div style={{ padding: "1rem 2rem 0" }}>
          <Container>
            <Alert
              message={
                <>
                  Your account isn't verified yet. Please{" "}
                  <Link to="/user/account/verify">click here</Link> to verify
                  your email address.
                </>
              }
              type="warning"
              showIcon
            />
          </Container>
        </div>
      )}
      <Content>
        <Outlet />
      </Content>
      <Footer />
    </>
  );
}

export default Layout;
