import { Card, Empty, Image, Table, Tag, message as antMessage } from "antd";
import React, { useState } from "react";
import CardTitle from "../../components/CartTitle";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getMyOrdersAsync, reset } from "../../features/auth/authSlice";
import { moneyFormatter, showError } from "../../utils";
import { useSearchParams } from "react-router-dom";

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

function MyOrders() {
  const [activeTabKey, setActiveTabKey] = useState("all");
  const [outerData, setOuterData] = useState([]);

  const dispatch = useDispatch();
  const { orders, message, isError } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMyOrdersAsync());
  }, []);

  useEffect(() => {
    if (isError) {
      showError(antMessage, message);
    }

    dispatch(reset());
  }, [isError]);

  useEffect(() => {
    const tempOuterData = [];
    for (let i = 0; i < orders.length; i++) {
      tempOuterData.push({
        key: i.toString(),
        id: orders[i]._id,
        orderItems: orders[i].orderItems,
        orderedAt: orders[i].createdAt,
        finishedAt: orders[i].status === "Completed" ? orders[i].updatedAt : "",
        paymentMethod:
          orders[i].paymentMethod === "Cash" ? "Cash On Delivery" : "Paypal",
        shippingFee: moneyFormatter.format(orders[i].shippingFee),
        orderTotal: moneyFormatter.format(orders[i].totalPayment),
        status: orders[i].status,
      });
    }
    setOuterData(tempOuterData);
  }, [orders]);

  const onTabChange = (key) => {
    setActiveTabKey(key);
  };

  const expandedRowRender = (record, index) => {
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
        align: "right",
      },
      {
        title: "Quantity",
        dataIndex: "quantity",
        key: "quantity",
        align: "right",
      },
      {
        title: "Item Subtotal",
        dataIndex: "itemSubtotal",
        key: "itemSubtotal",
        align: "right",
      },
    ];

    const data = [];
    const orderItems = outerData[index].orderItems;
    console.log(orderItems);
    for (let i = 0; i < orderItems.length; i++) {
      data.push({
        key: i.toString(),
        thumbnail:
          orderItems[i]?.product?.images?.length > 0
            ? orderItems[i]?.product?.images[0]?.url
            : "",
        productName: orderItems[i].product?.name,
        price: moneyFormatter.format(orderItems[i].product?.price),
        quantity: orderItems[i].quantity,
        itemSubtotal: moneyFormatter.format(
          orderItems[i].quantity * orderItems[i].product?.price
        ),
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
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
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

  const contentList = {
    all: (
      <Table
        columns={outerColumns}
        expandable={{ expandedRowRender }}
        dataSource={outerData}
      />
    ),
    toPay: (
      <Table
        columns={outerColumns}
        expandable={{ expandedRowRender }}
        dataSource={outerData.filter((order) => order.status === "To Pay")}
      />
    ),
    toShip: (
      <Table
        columns={outerColumns}
        expandable={{ expandedRowRender }}
        dataSource={outerData.filter((order) => order.status === "To Ship")}
      />
    ),
    toReceive: (
      <Table
        columns={outerColumns}
        expandable={{ expandedRowRender }}
        dataSource={outerData.filter((order) => order.status === "To Receive")}
      />
    ),
    completed: (
      <Table
        columns={outerColumns}
        expandable={{ expandedRowRender }}
        dataSource={outerData.filter((order) => order.status === "Completed")}
      />
    ),
    canceled: (
      <Table
        columns={outerColumns}
        expandable={{ expandedRowRender }}
        dataSource={outerData.filter((order) => order.status === "Canceled")}
      />
    ),
    return: (
      <Table
        columns={outerColumns}
        expandable={{ expandedRowRender }}
        dataSource={outerData.filter(
          (order) => order.status === "Return/Refund"
        )}
      />
    ),
  };

  return (
    <Card
      title={<CardTitle title="My Orders" />}
      tabList={tabList}
      activeTabKey={activeTabKey}
      onTabChange={(key) => {
        onTabChange(key);
      }}
    >
      {contentList[activeTabKey]}
    </Card>
  );
}

export default MyOrders;
