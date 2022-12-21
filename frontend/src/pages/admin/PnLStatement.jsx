import {
  Button,
  Card,
  DatePicker,
  Form,
  message as antMessage,
  Radio,
  Space,
  Spin,
  Table,
  Typography,
} from "antd";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersAsync, reset } from "../../features/order/orderSlice";
import { moneyFormatter, showError } from "../../utils";
import ReactToPrint from "react-to-print";
const { Text, Title } = Typography;
const { RangePicker } = DatePicker;

function PnLStatement() {
  const { orders, isSuccess, isError, isLoading, message } = useSelector(
    (state) => state.order
  );
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [filteredOrders, setFilteredOrders] = useState([]);
  const [outerData, setOuterData] = useState([]);
  const [outerData2, setOuterData2] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState();
  const [totalRevenue2, setTotalRevenue2] = useState();
  const [totalProfit, setTotalProfit] = useState();
  const [totalProfit2, setTotalProfit2] = useState();
  const componentRef = useRef();

  useEffect(() => {
    dispatch(getAllOrdersAsync());
  }, []);

  useEffect(() => {
    if (isError) {
      showError(antMessage, message);
    }

    dispatch(reset());
  }, [isError]);

  useEffect(() => {
    setFilteredOrders(orders.filter((o) => o.status === "Completed"));
  }, [orders]);

  useEffect(() => {
    const tempOuterData = [];
    for (let i = 0; i < filteredOrders.length; i++) {
      tempOuterData.push({
        key: i.toString(),
        orderId: filteredOrders[i]._id,
        orderItems: filteredOrders[i]?.orderItems,
        completedAt: moment(filteredOrders[i]?.completedAt).format(
          "YYYY-MM-DD HH:mm:ss"
        ),
        createdAt: moment(filteredOrders[i]?.createdAt).format(
          "YYYY-MM-DD HH:mm:ss"
        ),
        revenue:
          filteredOrders[i]?.totalPayment - filteredOrders[i]?.shippingFee,
        profit:
          filteredOrders[i]?.totalPayment -
          filteredOrders[i]?.shippingFee -
          filteredOrders[i]?.orderItems.reduce(
            (acc, cur) => acc + cur?.avgImportPrice * cur?.quantity,
            0
          ),
      });
    }
    setOuterData(tempOuterData);
    setTotalRevenue(tempOuterData.reduce((acc, cur) => acc + cur.revenue, 0));
    setTotalProfit(tempOuterData.reduce((acc, cur) => acc + cur.profit, 0));
  }, [filteredOrders]);

  const expandedRowRender = (record, index) => {
    const columns = [
      {
        title: "Product ID",
        dataIndex: "productId",
        key: "productId",
      },
      {
        title: "Name",
        dataIndex: "productName",
        key: "productName",
      },
      {
        title: "Selling Price",
        key: "sellingPrice",
        dataIndex: "sellingPrice",
        render: (_, { sellingPrice }) => moneyFormatter.format(sellingPrice),
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
        title: "Sub-Revenue",
        dataIndex: "subRevenue",
        key: "subRevenue",
        render: (_, { subRevenue }) => moneyFormatter.format(subRevenue),
      },
      {
        title: "Sub-Profit",
        dataIndex: "subProfit",
        key: "subProfit",
        render: (_, { subProfit }) => moneyFormatter.format(subProfit),
      },
    ];

    const innerData = [];
    const orderData = outerData.find((o) => o.orderId === record.orderId);
    const orderItems = orderData.orderItems;
    for (let i = 0; i < orderItems.length; i++) {
      innerData.push({
        key: i.toString(),
        productId: orderItems[i]?.product?._id,
        productName: orderItems[i].product?.name,
        sellingPrice: orderItems[i].price - orderItems[i]?.discount,
        avgImportPrice: orderItems[i]?.avgImportPrice,
        quantity: orderItems[i]?.quantity,
        subRevenue:
          orderItems[i]?.quantity *
          (orderItems[i]?.price - orderItems[i]?.discount),
        subProfit:
          (orderItems[i]?.price -
            orderItems[i].discount -
            orderItems[i]?.avgImportPrice) *
          orderItems[i]?.quantity,
      });
    }
    return (
      <Table
        columns={columns}
        dataSource={innerData}
        pagination={false}
        bordered
      />
    );
  };

  const outerColumns = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Completed At",
      dataIndex: "completedAt",
      key: "completedAt",
    },
    {
      title: "Revenue",
      dataIndex: "revenue",
      key: "revenue",
      render: (_, { revenue }) => moneyFormatter.format(revenue),
    },
    {
      title: "Profit",
      dataIndex: "profit",
      key: "profit",
      render: (_, { profit }) => moneyFormatter.format(profit),
    },
  ];

  const outerColumns2 = [
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "Revenue",
      dataIndex: "revenue",
      key: "revenue",
      render: (_, { revenue }) => moneyFormatter.format(revenue),
    },
    {
      title: "Profit",
      dataIndex: "profit",
      key: "profit",
      render: (_, { profit }) => moneyFormatter.format(profit),
    },
  ];

  const expandedRowRender2 = (record, index) => {
    const innerData2 = [];
    const orders = outerData2[index].orders;
    for (let i = 0; i < orders.length; i++) {
      innerData2.push({
        key: i.toString(),
        orderId: orders[i]?._id,
        orderItems: orders[i]?.orderItems,
        completedAt: moment(orders[i]?.completedAt).format(
          "YYYY-MM-DD HH:mm:ss"
        ),
        createdAt: moment(orders[i]?.createdAt).format("YYYY-MM-DD HH:mm:ss"),
        revenue: orders[i]?.totalPayment - filteredOrders[i]?.shippingFee,
        profit:
          orders[i]?.totalPayment -
          orders[i]?.shippingFee -
          orders[i]?.orderItems.reduce(
            (acc, cur) => acc + cur?.avgImportPrice * cur?.quantity,
            0
          ),
      });
    }

    return (
      <Table
        columns={outerColumns}
        dataSource={innerData2}
        pagination={false}
        bordered
      />
    );
  };

  const [type, setType] = useState("Detail");
  const [by1, setBy1] = useState("All the time");
  const [by2, setBy2] = useState("date");
  const options = [
    {
      label: "Detail",
      value: "Detail",
    },
    {
      label: "Range",
      value: "Range",
    },
  ];

  function onFinish(values) {
    if (by1 === "All the time") {
      setFilteredOrders(orders.filter((o) => o.status === "Completed"));
    } else if (by1 === "date") {
      setFilteredOrders(
        orders.filter(
          (o) =>
            o.status === "Completed" &&
            moment(o?.completedAt).isSame(
              values.datePicker.toISOString(),
              "date"
            )
        )
      );
    } else if (by1 === "month") {
      setFilteredOrders(
        orders.filter(
          (o) =>
            o.status === "Completed" &&
            moment(o?.completedAt).isSame(
              values.datePicker.toISOString(),
              "month"
            )
        )
      );
    } else if (by1 === "year") {
      setFilteredOrders(
        orders.filter(
          (o) =>
            o.status === "Completed" &&
            moment(o?.completedAt).isSame(
              values.datePicker.toISOString(),
              "year"
            )
        )
      );
    }
  }

  function onFinish2(values) {
    let startDate = values.datePicker[0].toISOString();
    let endDate = values.datePicker[1].toISOString();
    const tempOuterData2 = [];
    const completedOrders = orders.filter((o) => o.status === "Completed");
    if (by2 === "date") {
      while (!moment(startDate).isAfter(endDate, "date")) {
        const filteredOrders = completedOrders.filter((o) =>
          moment(o?.completedAt).isSame(startDate, "date")
        );
        if (filteredOrders.length === 0) {
          tempOuterData2.push({
            key: moment(startDate).format("YYYY-MM-DD"),
            time: moment(startDate).format("YYYY-MM-DD"),
            revenue: 0,
            profit: 0,
            orders: [],
          });
        } else {
          let revenue = 0;
          let profit = 0;
          for (const order of filteredOrders) {
            revenue += order.orderItems.reduce(
              (acc, cur) => acc + (cur?.price - cur?.discount) * cur?.quantity,
              0
            );
            profit += order.orderItems.reduce(
              (acc, cur) =>
                acc +
                (cur?.price - cur?.discount - cur?.avgImportPrice) *
                  cur?.quantity,
              0
            );
          }
          tempOuterData2.push({
            key: moment(startDate).format("YYYY-MM-DD"),
            time: moment(startDate).format("YYYY-MM-DD"),
            revenue: revenue,
            profit: profit,
            orders: filteredOrders,
          });
        }

        startDate = moment(startDate).add(1, "day");
      }
    } else if (by2 === "month") {
      while (!moment(startDate).isAfter(endDate, "month")) {
        const filteredOrders = completedOrders.filter((o) =>
          moment(o?.completedAt).isSame(startDate, "month")
        );
        if (filteredOrders.length === 0) {
          tempOuterData2.push({
            key: moment(startDate).format("YYYY-MM"),
            time: moment(startDate).format("YYYY-MM"),
            revenue: 0,
            profit: 0,
            orders: [],
          });
        } else {
          let revenue = 0;
          let profit = 0;
          for (const order of filteredOrders) {
            revenue += order.orderItems.reduce(
              (acc, cur) => acc + (cur?.price - cur?.discount) * cur?.quantity,
              0
            );
            profit += order.orderItems.reduce(
              (acc, cur) =>
                acc +
                (cur?.price - cur?.discount - cur?.avgImportPrice) *
                  cur?.quantity,
              0
            );
          }
          tempOuterData2.push({
            key: moment(startDate).format("YYYY-MM"),
            time: moment(startDate).format("YYYY-MM"),
            revenue: revenue,
            profit: profit,
            orders: filteredOrders,
          });
        }

        startDate = moment(startDate).add(1, "month");
      }
    } else if (by2 === "year") {
      while (!moment(startDate).isAfter(endDate, "year")) {
        const filteredOrders = completedOrders.filter((o) =>
          moment(o?.completedAt).isSame(startDate, "year")
        );
        if (filteredOrders.length === 0) {
          tempOuterData2.push({
            key: moment(startDate).format("YYYY"),
            time: moment(startDate).format("YYYY"),
            revenue: 0,
            profit: 0,
            orders: [],
          });
        } else {
          let revenue = 0;
          let profit = 0;
          for (const order of filteredOrders) {
            revenue += order.orderItems.reduce(
              (acc, cur) => acc + (cur?.price - cur?.discount) * cur?.quantity,
              0
            );
            profit += order.orderItems.reduce(
              (acc, cur) =>
                acc +
                (cur?.price - cur?.discount - cur?.avgImportPrice) *
                  cur?.quantity,
              0
            );
          }
          tempOuterData2.push({
            key: moment(startDate).format("YYYY"),
            time: moment(startDate).format("YYYY"),
            revenue: revenue,
            profit: profit,
            orders: filteredOrders,
          });
        }

        startDate = moment(startDate).add(1, "year");
      }
    }

    setOuterData2(tempOuterData2);
    setTotalRevenue2(tempOuterData2.reduce((acc, cur) => acc + cur.revenue, 0));
    setTotalProfit2(tempOuterData2.reduce((acc, cur) => acc + cur.profit, 0));
  }

  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const time1 = Form.useWatch("datePicker", form1);
  const time2 = Form.useWatch("datePicker", form2);

  return (
    <Card
      title="Profit And Loss Statement"
      extra={
        <ReactToPrint
          trigger={() => <Button type="primary">Print PnL Statement</Button>}
          content={() => componentRef.current}
        />
      }
    >
      <Space direction="vertical" style={{ display: "flex" }} size="middle">
        <Radio.Group
          options={options}
          onChange={(e) => setType(e.target.value)}
          value={type}
          optionType="button"
        />

        {type === "Detail" && (
          <Form
            initialValues={{ by: "All the time" }}
            onFinish={onFinish}
            form={form1}
          >
            <Form.Item name="by">
              <Radio.Group onChange={(e) => setBy1(e.target.value)} value={by1}>
                <Radio value="All the time">All the time</Radio>
                <Radio value="date">Date</Radio>
                <Radio value="month">Month</Radio>
                <Radio value="year">Year</Radio>
              </Radio.Group>
            </Form.Item>

            {by1 !== "All the time" && (
              <Form.Item
                name="datePicker"
                rules={[
                  {
                    type: "object",
                    required: true,
                    message: "Please select time!",
                  },
                ]}
              >
                <DatePicker
                  onChange={(date, dateString) => console.log(dateString)}
                  picker={by1}
                />
              </Form.Item>
            )}

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Apply
              </Button>
            </Form.Item>
          </Form>
        )}

        {type === "Range" && (
          <>
            <Form
              initialValues={{ by: "date" }}
              onFinish={onFinish2}
              form={form2}
            >
              <Form.Item name="by">
                <Radio.Group
                  onChange={(e) => setBy2(e.target.value)}
                  value={by1}
                >
                  <Radio value="date">Date</Radio>
                  <Radio value="month">Month</Radio>
                  <Radio value="year">Year</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                name="datePicker"
                rules={[
                  {
                    type: "array",
                    required: true,
                    message: "Please select time!",
                  },
                ]}
              >
                <RangePicker
                  onChange={(date, dateString) => console.log(dateString)}
                  picker={by2}
                />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Apply
                </Button>
              </Form.Item>
            </Form>
          </>
        )}

        <Spin spinning={isLoading}>
          {type === "Detail" ? (
            <div
              ref={componentRef}
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Text strong style={{ fontSize: "20px" }}>
                PROFIT AND LOSS STATEMENT DETAIL
              </Text>

              {by1 === "All the time" && <Text>Time: All the time</Text>}
              {by1 === "date" && (
                <Text>
                  Time:{" "}
                  <b>{moment(time1?.toISOString()).format("YYYY-MM-DD")}</b>
                </Text>
              )}
              {by1 === "month" && (
                <Text>
                  Time: <b>{moment(time1?.toISOString()).format("YYYY-MM")}</b>
                </Text>
              )}
              {by1 === "year" && (
                <Text>
                  Time: <b>{moment(time1?.toISOString()).format("YYYY")}</b>
                </Text>
              )}

              <br />

              <Table
                columns={outerColumns}
                expandable={{ expandedRowRender }}
                dataSource={outerData}
                bordered
                scroll={{
                  y: 720,
                }}
                pagination={false}
                footer={() => (
                  <Space
                    direction="vertical"
                    style={{ display: "flex", alignItems: "flex-end" }}
                  >
                    <Space
                      style={{
                        width: "250px",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text>Total Revenue: </Text>
                      <Text strong>{moneyFormatter.format(totalRevenue)}</Text>
                    </Space>
                    <Space
                      style={{
                        width: "250px",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text>Total Profit: </Text>
                      <Text strong>{moneyFormatter.format(totalProfit)}</Text>
                    </Space>
                  </Space>
                )}
              />

              <br />
              <div
                style={{
                  width: "350px",
                  alignSelf: "flex-end",
                }}
              >
                <Space
                  direction="vertical"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Text>Ho Chi Minh City, {moment().format("LL")}</Text>
                  <Text>Statement by</Text>
                  <br />
                  <Text>{user?.fullName}</Text>
                </Space>
              </div>
            </div>
          ) : (
            <div
              ref={componentRef}
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Text strong style={{ fontSize: "20px" }}>
                PROFIT AND LOSS STATEMENT
              </Text>

              {time2 && (
                <>
                  {by2 === "date" && (
                    <Text>
                      From:{" "}
                      <b>
                        {moment(time2[0]?.toISOString()).format("YYYY-MM-DD")}
                      </b>{" "}
                      to:{" "}
                      <b>
                        {moment(time2[1]?.toISOString()).format("YYYY-MM-DD")}
                      </b>
                    </Text>
                  )}
                  {by2 === "month" && (
                    <Text>
                      From:{" "}
                      <b>{moment(time2[0]?.toISOString()).format("YYYY-MM")}</b>{" "}
                      to:{" "}
                      <b>{moment(time2[1]?.toISOString()).format("YYYY-MM")}</b>
                    </Text>
                  )}
                  {by2 === "year" && (
                    <Text>
                      From:{" "}
                      <b>{moment(time2[0]?.toISOString()).format("YYYY")}</b>{" "}
                      to:{" "}
                      <b>{moment(time2[1]?.toISOString()).format("YYYY")}</b>
                    </Text>
                  )}
                </>
              )}

              <br />

              <Table
                columns={outerColumns2}
                expandable={{ expandedRowRender: expandedRowRender2 }}
                dataSource={outerData2}
                bordered
                scroll={{
                  y: 720,
                }}
                pagination={false}
                footer={() => (
                  <Space
                    direction="vertical"
                    style={{ display: "flex", alignItems: "flex-end" }}
                  >
                    <Space
                      style={{
                        width: "250px",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text>Total Revenue: </Text>
                      <Text strong>{moneyFormatter.format(totalRevenue2)}</Text>
                    </Space>
                    <Space
                      style={{
                        width: "250px",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text>Total Profit: </Text>
                      <Text strong>{moneyFormatter.format(totalProfit2)}</Text>
                    </Space>
                  </Space>
                )}
              />

              <br />
              <div
                style={{
                  width: "350px",
                  alignSelf: "flex-end",
                }}
              >
                <Space
                  direction="vertical"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Text>Ho Chi Minh City, {moment().format("LL")}</Text>
                  <Text>Statement by</Text>
                  <br />
                  <Text>{user?.fullName}</Text>
                </Space>
              </div>
            </div>
          )}
        </Spin>
      </Space>
    </Card>
  );
}

export default PnLStatement;
