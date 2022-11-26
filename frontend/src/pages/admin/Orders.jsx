import { Card, Empty, Image, Table, Tabs, Tag } from "antd";
import React, { useState } from "react";

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

function Orders() {
  const [activeTabKey1, setActiveTabKey1] = useState("all");

  const onTab1Change = (key) => {
    setActiveTabKey1(key);
  };

  const expandedRowRender = () => {
    const columns = [
      {
        title: "Thumbnail",
        dataIndex: "thumbnail",
        key: "thumbnail",
        render: (_, { thumbnail }) => <Image width={100} src={thumbnail} />,
      },
      {
        title: "Product Name",
        dataIndex: "productName",
        key: "productName",
      },
      {
        title: "Unit Price",
        key: "price",
        dataIndex: "price",
      },
      {
        title: "Quantity",
        dataIndex: "quantity",
        key: "quantity",
      },
      {
        title: "Item Subtotal",
        dataIndex: "itemSubtotal",
        key: "itemSubtotal",
      },
    ];

    const data = [];
    for (let i = 0; i < 3; ++i) {
      data.push({
        key: i.toString(),
        thumbnail:
          "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
        productName: "Product Name",
        price: "100000",
        quantity: "10",
        itemSubtotal: "1000000",
      });
    }
    return <Table columns={columns} dataSource={data} pagination={false} />;
  };

  const outerColumns = [
    {
      title: "Ordered At",
      dataIndex: "orderedAt",
      key: "orderedAt",
    },
    {
      title: "Finished At",
      dataIndex: "finishedAt",
      key: "finishedAt",
    },
    {
      title: "Shipping Fee",
      dataIndex: "shippingFee",
      key: "shippingFee",
    },
    {
      title: "Order Total",
      dataIndex: "orderTotal",
      key: "orderTotal",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, { status }) => {
        let color = "green";
        if (status === "To Pay") {
          color = "blue";
        } else if (status === "To Ship") {
          color = "cyan";
        } else if (status === "To Receive") {
          color = "purple";
        } else if (status === "Canceled") {
          color = "red";
        } else if (status === "Return/Refund") {
          color = "magenta";
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
    // {
    //   title: "Action",
    //   key: "operation",
    //   render: () => <Link to="#">See Details</Link>,
    // },
  ];

  const outerData = [];
  for (let i = 0; i < 3; ++i) {
    outerData.push({
      key: i.toString(),
      orderedAt: "11/26/2022",
      finishedAt: "",
      shippingFee: "15000",
      orderTotal: "1000000",
      status: "To Pay",
    });
  }

  const contentList = {
    all: (
      <Table
        columns={outerColumns}
        expandable={{ expandedRowRender }}
        dataSource={outerData}
      />
    ),
    toPay: <Empty />,
    toShip: <Empty />,
    toReceive: <Empty />,
    completed: <Empty />,
    canceled: <Empty />,
    return: <Empty />,
  };

  return (
    <Card
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
