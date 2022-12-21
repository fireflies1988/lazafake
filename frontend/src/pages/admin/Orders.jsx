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
  Typography,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import OrderDrawer from "../../components/drawers/OrderDrawer";
import { getAllOrdersAsync, reset } from "../../features/order/orderSlice";
import { moneyFormatter, showError } from "../../utils";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
import moment from "moment";
const { Text } = Typography;

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
        orderId: orders[i]._id,
        email: orders[i]?.user?.email,
        shippingAddress: orders[i]?.shippingAddress,
        orderDetails: orders[i],
        orderItems: orders[i].orderItems,
        orderedAt: moment(orders[i].createdAt).format("YYYY-MM-DD HH:mm:ss"),
        finishedAt: orders[i]?.completedAt
          ? moment(orders[i]?.completedAt).format("YYYY-MM-DD HH:mm:ss")
          : "",
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
        title: "Product ID",
        dataIndex: "productId",
        key: "productId",
      },
      {
        title: "Thumbnail",
        dataIndex: "thumbnail",
        key: "thumbnail",
        render: (_, { thumbnail }) => <Image width={50} src={thumbnail} />,
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
        render: (_, record) => (
          <Space>
            <Text>{moneyFormatter.format(record.price - record.discount)}</Text>
            {record.discount > 0 && (
              <Text
                type="secondary"
                delete
                style={{
                  fontSize: "12px",
                }}
              >
                {moneyFormatter.format(record.price)}
              </Text>
            )}
          </Space>
        ),
      },
      {
        title: "Average Import Price",
        key: "avgImportPrice",
        dataIndex: "avgImportPrice",
        render: (_, { avgImportPrice }) =>
          moneyFormatter.format(avgImportPrice),
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
    const orderItems = outerData.find(
      (o) => o.orderId === record.orderId
    ).orderItems;
    console.log({ outerData });
    for (let i = 0; i < orderItems.length; i++) {
      data.push({
        key: i.toString(),
        productId: orderItems[i]?.product?._id,
        thumbnail:
          orderItems[i]?.product?.images?.length > 0
            ? orderItems[i]?.product?.images[0]?.url
            : "",
        productName: orderItems[i]?.product?.name,
        price: orderItems[i].price,
        avgImportPrice: orderItems[i]?.avgImportPrice,
        discount: orderItems[i].discount,
        quantity: orderItems[i]?.quantity,
        itemSubtotal: moneyFormatter.format(
          orderItems[i]?.quantity *
            (orderItems[i].price - orderItems[i].discount)
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
      fixed: "left",
      ...getColumnSearchProps("orderId"),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      fixed: "left",
      ...getColumnSearchProps("email"),
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
      fixed: "right",
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          onClick={() => {
            setOrderId(record.orderId);
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
        scroll={{
          x: 1500,
        }}
        onChange={handleChange}
      />
    ),
    toPay: (
      <Table
        columns={outerColumns}
        expandable={{ expandedRowRender }}
        dataSource={outerData.filter((order) => order.status === "To Pay")}
        scroll={{
          x: 1500,
        }}
        onChange={handleChange}
      />
    ),
    toShip: (
      <Table
        columns={outerColumns}
        expandable={{ expandedRowRender }}
        dataSource={outerData.filter((order) => order.status === "To Ship")}
        scroll={{
          x: 1500,
        }}
        onChange={handleChange}
      />
    ),
    toReceive: (
      <Table
        columns={outerColumns}
        expandable={{ expandedRowRender }}
        dataSource={outerData.filter((order) => order.status === "To Receive")}
        scroll={{
          x: 1500,
        }}
        onChange={handleChange}
      />
    ),
    completed: (
      <Table
        columns={outerColumns}
        expandable={{ expandedRowRender }}
        dataSource={outerData.filter((order) => order.status === "Completed")}
        scroll={{
          x: 1500,
        }}
        onChange={handleChange}
      />
    ),
    canceled: (
      <Table
        columns={outerColumns}
        expandable={{ expandedRowRender }}
        dataSource={outerData.filter((order) => order.status === "Canceled")}
        scroll={{
          x: 1500,
        }}
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
        scroll={{
          x: 1500,
        }}
        onChange={handleChange}
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
