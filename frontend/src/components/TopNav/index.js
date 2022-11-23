import React from "react";
import { StyledTopNav } from "./styled";
import logo from "../../assets/logo.png";
import { Badge, Button, Dropdown, Input } from "antd";
import { LogoutOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import { BsInboxes } from "react-icons/bs";

const { Search } = Input;

const items = [
  {
    key: "1",
    label: (
      <a target="_self" rel="noopener noreferrer" href="/">
        My Account
      </a>
    ),
    icon: <UserOutlined />,
  },
  {
    key: "2",
    label: (
      <a target="_self" rel="noopener noreferrer" href="https://www.aliyun.com">
        My Orders
      </a>
    ),
    icon: <BsInboxes />,
  },
  {
    type: "divider",
  },
  {
    key: "3",
    label: (
      <a
        target="_self"
        rel="noopener noreferrer"
        href="https://www.luohanacademy.com"
      >
        Logout
      </a>
    ),
    icon: <LogoutOutlined />,
  },
];

function TopNav() {
  const isLoggedIn = false;
  const onSearch = (value) => console.log(value);

  return (
    <StyledTopNav>
      <div className="container">
        <Button type="link" href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: 0 }}>
          <img src={logo} alt="logo" width={44} height={44} />
          <div className="logo">LazaFake</div>
        </Button>

        <Search
          placeholder="What do you want to buy?"
          onSearch={onSearch}
          enterButton
          allowClear
          size="large"
          style={{ marginLeft: "1rem", flex: 1 }}
        />

        <Link to="/cart">
          <Badge count={4} overflowCount={99}>
            <ShoppingCartOutlined
              style={{ color: "white", fontSize: "32px", marginLeft: "1rem" }}
            />
          </Badge>
        </Link>

        {isLoggedIn ? (
          <Dropdown
            menu={{
              items,
            }}
            placement="bottomRight"
            arrow
          >
            <Avatar
              size="large"
              icon={<UserOutlined />}
              style={{ marginLeft: "1rem" }}
            />
          </Dropdown>
        ) : (
          <>
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
              style={{ color: "white", fontWeight: "600", paddingRight: "0" }}
              size="large"
            >
              Login
            </Button>
          </>
        )}
      </div>
    </StyledTopNav>
  );
}

export default TopNav;
