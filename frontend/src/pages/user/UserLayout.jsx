import { BellOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Card, Col, Menu, Row } from "antd";
import React, { useState } from "react";
import { BsInboxes } from "react-icons/bs";
import { RiCoupon3Line } from "react-icons/ri";
import { Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const items = [
  {
    label: "My Account",
    key: "account",
    icon: <UserOutlined />,
    children: [
      {
        label: <a href="/user/account/profile">Profile</a>,
        key: "profile",
      },
      {
        label: <a href="/user/account/address-book">Address Book</a>,
        key: "address-book",
      },
      {
        label: <a href="/user/account/password">Change Password</a>,
        key: "password",
      },
      {
        label: <a href="/user/account/verify">Verify Email Address</a>,
        key: "verify",
      },
    ],
  },
  {
    label: <a href="/user/orders">My Orders</a>,
    key: "orders",
    icon: <BsInboxes />,
  },
  {
    label: <a href="/user/notifications">Notifications</a>,
    key: "notifications",
    icon: <BellOutlined />,
  },
  // {
  //   label: <a href="/user/vouchers">My Vouchers</a>,
  //   key: "vouchers",
  //   icon: <RiCoupon3Line />,
  // },
];

function UserLayout() {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);
  const [currentKey, setCurrentKey] = useState(segments[segments.length - 1]);
  const defaultOpenKey = segments[segments.length - 2];

  return (
    <Row gutter={16}>
      <Col span={4}>
        <Card
          title={
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <Avatar
                size="large"
                style={{ backgroundColor: "#87d068", flexShrink: 0 }}
                icon={<UserOutlined />}
                src={user?.avatar?.url}
              />
              <div>{user?.fullName}</div>
            </div>
          }
          bodyStyle={{ padding: "0.25rem 0" }}
        >
          <Menu
            onClick={(e) => setCurrentKey(e.key)}
            selectedKeys={[currentKey]}
            defaultOpenKeys={[defaultOpenKey]}
            mode="inline"
            items={items}
          />
        </Card>
      </Col>

      <Col span={20}>
        <Outlet />
      </Col>
    </Row>
  );
}

export default UserLayout;
