import { Col, Row } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserStatistics from "../../components/statistics/UserStatistics";
import { getAllOrdersAsync } from "../../features/order/orderSlice";
import { getProductsAsync } from "../../features/product/productSlice";

function Dashboard() {
  const { products } = useSelector((state) => state.product);
  const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProductsAsync());
    dispatch(getAllOrdersAsync());
  }, []);

  return (
    <Row gutter={[16, 16]}>
      <Col span={12}>
        <UserStatistics />
      </Col>

      <Col span={12}>
        
      </Col>
    </Row>
  );
}

export default Dashboard;
