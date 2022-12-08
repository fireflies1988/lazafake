import { ConsoleSqlOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Image,
  Input,
  message as antMessage,
  Space,
  Spin,
  Table,
  Tag,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CardTitle from "../../components/CartTitle";
import OrderDrawer from "../../components/drawers/OrderDrawer";
import { getMyOrdersAsync, reset } from "../../features/auth/authSlice";
import { moneyFormatter, showError } from "../../utils";
import Highlighter from "react-highlight-words";
import moment from "moment";
import { getReviewsAsync } from "../../features/review/reviewSlice";
import ReviewModal from "../../components/modals/ReviewModal";

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
  const [orderId, setOrderId] = useState();
  const [open, setOpen] = useState(false);

  const [openReview, setOpenReview] = useState(false);
  const [reviewData, setReviewData] = useState();
  const [type, setType] = useState("add");

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orders, message, isError, isLoading } = useSelector(
    (state) => state.auth
  );
  const { reviews } = useSelector((state) => state.review);

  useEffect(() => {
    dispatch(getMyOrdersAsync());
    dispatch(getReviewsAsync({ userId: user._id }));
  }, []);

  // ---- filter orderId
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });
  // ----

  // ---- filter payment method
  const [filteredInfo, setFilteredInfo] = useState({});
  const handleChange = (pagination, filters, sorter) => {
    console.log("Various parameters", pagination, filters, sorter);
    setFilteredInfo(filters);
  };
  // ----

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
        orderId: orders[i]._id,
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

  const onTabChange = (key) => {
    setActiveTabKey(key);
  };

  const expandedRowRender = (record, index) => {
    const columns = [
      {
        title: "Product ID",
        dataIndex: "productId",
        key: "productId",
      },
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
      {
        title: "Action",
        key: "operation",
        render: (_, record) => {
          const review = reviews.find(
            (r) =>
              r.product === record.productId &&
              r.order === record.orderData.orderId
          );
          console.log({ review });

          if (record.orderData.status === "Completed") {
            if (review) {
              return (
                <Button
                  type="link"
                  size="small"
                  onClick={() => {
                    setOpenReview(true);
                    setType("edit");
                    setReviewData(review);
                  }}
                >
                  Your Review
                </Button>
              );
            } else {
              return (
                <Button
                  type="link"
                  size="small"
                  onClick={() => {
                    setOpenReview(true);
                    setType("add");
                    setReviewData({
                      order: record.orderData.orderId,
                      product: record.productId,
                    });
                  }}
                >
                  Review
                </Button>
              );
            }
          } else {
            return "";
          }
        },
      },
    ];

    const data = [];
    const orderData = outerData.find((o) => o.orderId === record.orderId);
    console.log({ orderData });
    const orderItems = orderData.orderItems;
    console.log(orderItems);
    for (let i = 0; i < orderItems.length; i++) {
      data.push({
        key: i.toString(),
        orderData: orderData,
        productId: orderItems[i]?.product?._id,
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
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
      ...getColumnSearchProps("orderId"),
    },
    {
      title: "Ordered At",
      dataIndex: "orderedAt",
      key: "orderedAt",
      sorter: (a, b) => moment(a.orderedAt).unix() - moment(b.orderedAt).unix(),
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
      filters: [
        {
          text: "Cash On Delivery",
          value: "Cash",
        },
        {
          text: "Paypal",
          value: "Paypal",
        },
      ],
      filteredValue: filteredInfo.paymentMethod || null,
      onFilter: (value, record) => record.paymentMethod.includes(value),
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
            setOrderId(record.orderId);
            setOpen(true);
          }}
        >
          View Details
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
        onChange={handleChange}
      />
    ),
    toPay: (
      <Table
        columns={outerColumns}
        expandable={{ expandedRowRender }}
        dataSource={outerData.filter((order) => order.status === "To Pay")}
        onChange={handleChange}
      />
    ),
    toShip: (
      <Table
        columns={outerColumns}
        expandable={{ expandedRowRender }}
        dataSource={outerData.filter((order) => order.status === "To Ship")}
        onChange={handleChange}
      />
    ),
    toReceive: (
      <Table
        columns={outerColumns}
        expandable={{ expandedRowRender }}
        dataSource={outerData.filter((order) => order.status === "To Receive")}
        onChange={handleChange}
      />
    ),
    completed: (
      <Table
        columns={outerColumns}
        expandable={{ expandedRowRender }}
        dataSource={outerData.filter((order) => order.status === "Completed")}
        onChange={handleChange}
      />
    ),
    canceled: (
      <Table
        columns={outerColumns}
        expandable={{ expandedRowRender }}
        dataSource={outerData.filter((order) => order.status === "Canceled")}
        onChange={handleChange}
      />
    ),
    return: (
      <Table
        columns={outerColumns}
        expandable={{ expandedRowRender }}
        dataSource={outerData.filter(
          (order) => order.status === "Return/Refund"
        )}
        onChange={handleChange}
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
      <Spin spinning={isLoading}>{contentList[activeTabKey]}</Spin>
      <OrderDrawer
        orderId={orderId}
        open={open}
        onClose={() => setOpen(false)}
        type="user"
      />
      <ReviewModal
        open={openReview}
        onCancel={() => setOpenReview(false)}
        reviewData={reviewData}
        type={type}
      />
    </Card>
  );
}

export default MyOrders;
