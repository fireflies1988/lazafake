import { BellOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Badge, Button, Col, Dropdown, Input, Row } from "antd";
import React from "react";
import { BsInboxes } from "react-icons/bs";
import logo from "../../assets/logo.png";
import Container from "../Container";
import { StyledAdminTopNav } from "./styled";

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
  return (
    <StyledAdminTopNav>
      <Container>
        <Row gutter={16}>
          <Col span={4} style={{ display: "flex", alignItems: "center" }}>
            <Button
              type="link"
              href="/admin/dashboard"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: 0,
              }}
            >
              <img src={logo} alt="logo" width={44} height={44} />
              <div className="logo">LazaFake Admin</div>
            </Button>
          </Col>

          <Col
            span={20}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.5rem",
              justifyContent: "flex-end",
            }}
          >
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
          </Col>
        </Row>
      </Container>
    </StyledAdminTopNav>
  );
}

export default TopNav;
