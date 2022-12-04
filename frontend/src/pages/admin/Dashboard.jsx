import React from "react";
import { Card, Col, Row, Statistic } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getUsersAsync } from "../../features/auth/authSlice";
import { getProductsAsync } from "../../features/product/productSlice";
import { getAllOrdersAsync } from "../../features/order/orderSlice";
import { moneyFormatter } from "../../utils";

function Dashboard() {
  const { users } = useSelector((state) => state.auth);
  const { products } = useSelector((state) => state.product);
  const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUsersAsync());
    dispatch(getProductsAsync());
    dispatch(getAllOrdersAsync());
  }, []);

  return (  
    <Card title="Dashboard">
      <Row gutter={(16, 16)}>
        <Col span={8}>
          <Statistic title="Active Users" value={users.length} />
        </Col>
        <Col span={8}>
          <Statistic title="Number of Products" value={products.length} />
        </Col>
        <Col span={8}>
          <Statistic title="Orders Received" value={orders.length} />
        </Col>
        <Col span={8}>
          <Statistic
            title="Total Revenue"
            value={moneyFormatter.format(
              orders.reduce((acc, obj) => acc + obj.totalPayment, 0)
            )}
          />
        </Col>
      </Row>
    </Card>
  );
}

export default Dashboard;
