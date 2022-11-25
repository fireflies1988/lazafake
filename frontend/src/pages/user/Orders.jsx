import { Card, Empty } from "antd";
import React, { useState } from "react";
import CardTitle from "../../components/CartTitle";

const tabList = [
  {
    key: "all",
    tab: "All",
  },
  {
    key: "toPay",
    tab: "To Pay",
  },
  {
    key: "toShip",
    tab: "To Ship",
  },
  {
    key: "toReceive",
    tab: "To Receive",
  },
  {
    key: "completed",
    tab: "Completed",
  },
  {
    key: "canceled",
    tab: "Canceled",
  },
  {
    key: "return",
    tab: "Return/Refund",
  },
];

const contentList = {
  all: <Empty />,
  toPay: <Empty />,
  toShip: <Empty />,
  toReceive: <Empty />,
  completed: <Empty />,
  canceled: <Empty />,
  return: <Empty />,
};

function Orders() {
  const [activeTabKey1, setActiveTabKey1] = useState("all");

  const onTab1Change = (key) => {
    setActiveTabKey1(key);
  };

  return (
    <Card
      title={<CardTitle title="My Orders" />}
      tabList={tabList}
      activeTabKey={activeTabKey1}
      onTabChange={(key) => {
        onTab1Change(key);
      }}
    >
      {contentList[activeTabKey1]}
    </Card>
  );
}

export default Orders;
