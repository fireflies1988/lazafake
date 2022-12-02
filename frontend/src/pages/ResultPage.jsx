import { Button, Card, Result } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

function ResultPage() {
  const navigate = useNavigate();
  const status = window.location.search?.substring(1) || "success";

  return (
    <Card>
      <Result
        status={status}
        title={
          status === "success"
            ? "Your Order Successfully Placed!"
            : "Oops, Payment Failed!"
        }
        subTitle={
          status === "success"
            ? "Thank you so much for your order, LazaFake wishes you a merry Christmas."
            : "Error: 499."
        }
        extra={[
          <Button type="primary" onClick={() => navigate("/user/orders")}>
            View Your Orders
          </Button>,
        ]}
      />
    </Card>
  );
}

export default ResultPage;
