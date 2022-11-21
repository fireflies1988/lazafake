import React from "react";
import { StyledTopNav } from "./styled";
import logo from "../../assets/logo.png";
import { Button, Input } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";

const { Search } = Input;

function TopNav() {
  const onSearch = (value) => console.log(value);

  return (
    <StyledTopNav>
      <div className="container">
        <img src={logo} alt="logo" width={44} height={44} />
        <div className="logo">LazaFake</div>

        <Search
          placeholder="What do you want to buy?"
          onSearch={onSearch}
          enterButton
          allowClear
          size="large"
          style={{ marginLeft: "1rem" }}
        />

        <ShoppingCartOutlined
          style={{ color: "white", fontSize: "32px", marginLeft: "1rem" }}
        />
        <Button
          type="link"
          href="/register"
          style={{ color: "white", fontWeight: "600", paddingRight: "0" }}
          size="large"
        >
          Sign Up
        </Button>
        <Button
          type="link"
          href="/login"
          style={{ color: "white", fontWeight: "600" }}
          size="large"
        >
          Login
        </Button>
      </div>
    </StyledTopNav>
  );
}

export default TopNav;
