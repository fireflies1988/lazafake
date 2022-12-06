import { Col, Row } from "antd";
import React from "react";
import OrderStatistics from "../../components/statistics/OrderStatistics";
import ProductStatistics from "../../components/statistics/ProductStatistics";
import UserStatistics from "../../components/statistics/UserStatistics";

function Dashboard() {
  return (
    <Row gutter={[16, 16]}>
      <Col span={12}>
        <UserStatistics />
      </Col>

      <Col span={12}>
        <ProductStatistics />
      </Col>

      <Col span={24}>
        <OrderStatistics />
      </Col>
    </Row>
  );
}

export default Dashboard;
