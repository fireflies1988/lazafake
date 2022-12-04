import {
  Button,
  Card,
  Image,
  message as antMessage,
  Spin,
  Table,
  Tag,
} from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import OrderDrawer from "../../components/drawers/OrderDrawer";
import { getAllOrdersAsync, reset } from "../../features/order/orderSlice";
import { moneyFormatter, showError } from "../../utils";

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
  const [activeTabKey, setActiveTabKey] = useState("all");
  const [outerData, setOuterData] = useState([]);
  const [orderId, setOrderId] = useState();
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();
  const { orders, message, isError, isSuccess, isLoading } = useSelector(
    (state) => state.order
  );

  const onTabChange = (key) => {
    setActiveTabKey(key);
  };

  useEffect(() => {
    dispatch(getAllOrdersAsync());
  }, []);

  useEffect(() => {
    if (isError) {
      showError(antMessage, message);
    }

    if (isSuccess) {
      antMessage.success(message);
    }

    dispatch(reset());
  }, [isError, isSuccess]);

  useEffect(() => {
    const tempOuterData = [];
    for (let i = 0; i < orders.length; i++) {
      tempOuterData.push({
        key: i.toString(),
        id: orders[i]._id,
        orderDetails: orders[i],
        orderItems: orders[i].orderItems,
        orderedAt: orders[i].createdAt,
        finishedAt: orders[i]?.completedAt ?? "",
        paymentMethod:
          orders[i].paymentMethod === "Cash" ? "Cash On Delivery" : "Paypal",
        shippingFee: moneyFormatter.format(orders[i].shippingFee),
        orderTotal: moneyFormatter.format(orders[i].totalPayment),
        status: orders[i].status,
      });
    }
    setOuterData(tempOuterData);
  }, [orders]);

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
    {
      title: "Action",
      key: "operation",
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          onClick={() => {
            setOrderId(record.id);
            setOpen(true);
          }}
        >
          Update
        </Button>
      ),
    },
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
      tabList={tabList}
      activeTabKey={activeTabKey}
      onTabChange={(key) => {
        onTabChange(key);
      }}
    >
      <Spin spinning={isLoading}>{contentList[activeTabKey]}</Spin>
      <OrderDrawer
        orderId={orderId}
        open={open}
        onClose={() => setOpen(false)}
        type="admin"
      />
    </Card>
  );
}

export default Orders;
