import React from "react";
import { StyledTopNav } from "./styled";
import logo from "../../assets/logo.png";
import { Badge, Button, Col, Dropdown, Input, Row } from "antd";
import {
  BellOutlined,
  LogoutOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import { BsInboxes } from "react-icons/bs";
import Container from "../Container";

const { Search } = Input;

const items = [
  {
    key: "1",
    label: (
      <a target="_self" rel="noopener noreferrer" href="/user/account/profile">
        My Account
      </a>
    ),
    icon: <UserOutlined />,
  },
  {
    key: "2",
    label: (
      <a target="_self" rel="noopener noreferrer" href="/user/orders">
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
  const isLoggedIn = true;
  const onSearch = (value) => console.log(value);

  return (
    <StyledTopNav>
      <Container>
        <Row gutter={16}>
          <Col span={4} style={{ display: "flex", alignItems: "center" }}>
            <Button
              type="link"
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: 0,
              }}
            >
              <img src={logo} alt="logo" width={44} height={44} />
              <div className="logo">LazaFake</div>
            </Button>
          </Col>

          <Col
            span={20}
            style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}
          >
            <Search
              placeholder="What do you want to buy?"
              onSearch={onSearch}
              enterButton
              allowClear
              size="large"
              style={{ flex: 1 }}
            />

            <Link to="/cart">
              <Badge count={2} overflowCount={99}>
                <ShoppingCartOutlined
                  style={{ color: "white", fontSize: "30px" }}
                />
              </Badge>
            </Link>

            {isLoggedIn ? (
              <>
                <Badge count={1} overflowCount={99}>
                  <BellOutlined style={{ color: "white", fontSize: "24px" }} />
                </Badge>
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
                    style={{ cursor: "pointer" }}
                  />
                </Dropdown>
              </>
            ) : (
              <>
                <Button
                  type="link"
                  href="/register"
                  style={{ color: "white", fontWeight: "600", paddingRight: 0 }}
                  size="large"
                >
                  Sign Up
                </Button>

                <Button
                  type="link"
                  href="/login"
                  style={{
                    color: "white",
                    fontWeight: "600",
                    paddingRight: 0,
                    paddingLeft: 0,
                  }}
                  size="large"
                >
                  Login
                </Button>
              </>
            )}
          </Col>
        </Row>
      </Container>
    </StyledTopNav>
  );
}

export default TopNav;
