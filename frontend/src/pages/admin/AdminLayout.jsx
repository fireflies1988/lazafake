import { Card, Col, Menu, Row } from "antd";
import React, { useState } from "react";
import { FaUserCog } from "react-icons/fa";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { RiCoupon3Line, RiProductHuntLine } from "react-icons/ri";
import { Outlet, useLocation } from "react-router-dom";
import AdminTopNav from "../../components/AdminTopNav";
import Content from "../../components/Content";
import { BiCategory } from "react-icons/bi";
import { BsInboxes } from "react-icons/bs";

const items = [
  {
    label: <a href="/admin/dashboard">Dashboard</a>,
    key: "dashboard",
    icon: <MdOutlineSpaceDashboard />,
  },
  {
    label: <a href="/admin/users">Users</a>,
    key: "users",
    icon: <FaUserCog />,
  },
  {
    label: <a href="/admin/categories">Categories</a>,
    key: "categories",
    icon: <BiCategory />,
  },
  {
    label: <a href="/admin/products">Products</a>,
    key: "products",
    icon: <RiProductHuntLine />,
  },
  {
    label: <a href="/admin/products">Vouchers</a>,
    key: "vouchers",
    icon: <RiCoupon3Line />,
  },
  {
    label: <a href="/admin/orders">Orders</a>,
    key: "orders",
    icon: <BsInboxes />,
  },
];

function AdminLayout() {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);
  const [currentKey, setCurrentKey] = useState(segments[segments.length - 1]);

  return (
    <>
      <AdminTopNav />
      <Content>
        <Row gutter={16}>
          <Col span={4}>
            <Card bodyStyle={{ padding: "0.25rem 0" }}>
              <Menu
                onClick={(e) => setCurrentKey(e.key)}
                selectedKeys={[currentKey]}
                mode="inline"
                items={items}
              />
            </Card>
          </Col>

          <Col span={20}>
            <Outlet />
          </Col>
        </Row>
      </Content>
    </>
  );
}

export default AdminLayout;
