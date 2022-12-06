import { Card, Col, Row, Select, Statistic } from "antd";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersAsync } from "../../features/order/orderSlice";
import { moneyFormatter } from "../../utils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  PointElement,
  LineElement
);

const barOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Monthly Orders",
      position: "bottom",
    },
  },
};

const lineOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Monthly Revenue",
      position: "bottom",
    },
  },
};

const labels = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// monthly orders
function calculateBarData(orders, year, type) {
  const res = [];
  // filter by year
  const data = orders.filter((o) => moment(o.createdAt).isSame(year, "year"));
  for (let i = 1; i <= 12; i++) {
    // filter by month
    const temp = data.filter(
      (o) => moment(o.createdAt).format("M") === i.toString()
    );

    // filter by status
    if (type === "canceled") {
      res.push(
        temp.filter(
          (o) => o.status === "Canceled" || o.status === "Return/Refund"
        ).length
      );
    } else if (type === "completed") {
      res.push(temp.filter((o) => o.status === "Completed").length);
    } else if (type === "all") {
      res.push(temp.length);
    }
  }
  return res;
}

// monthly revenue
function calculateLineData(orders, year) {
  const res = [];
  const data = orders.filter((o) => moment(o.createdAt).isSame(year, "year"));
  for (let i = 1; i <= 12; i++) {
    res.push(
      data
        .filter((o) => moment(o.createdAt).format("M") === i.toString())
        .reduce((acc, cur) => {
          if (cur.status === "Completed") {
            acc += cur.totalPayment;
          }
          return acc;
        }, 0)
    );
  }
  return res;
}

const initialYear = moment().format("Y");

function OrderStatistics() {
  const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  const [year, setYear] = useState(initialYear);
  const [barData, setBarData] = useState({
    labels,
    datasets: [
      {
        label: "Canceled Orders",
        data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 40)),
        backgroundColor: "#ff7875",
      },
      {
        label: "Sales",
        data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 40)),
        backgroundColor: "#fff566",
      },
      {
        label: "Orders",
        data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 40)),
        backgroundColor: "#87e8de",
      },
    ],
  });
  const [lineData, setLineData] = useState({
    labels,
    datasets: [
      {
        fill: true,
        label: "Revenue",
        data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 40)),
        borderColor: "#d3f261",
        backgroundColor: "#f4ffb8",
        tension: 0.3,
      },
    ],
  });

  useEffect(() => {
    dispatch(getAllOrdersAsync());
  }, []);

  useEffect(() => {
    setBarData({
      labels,
      datasets: [
        {
          label: "Canceled Orders",
          data: calculateBarData(orders, year, "canceled"),
          backgroundColor: "#ff7875",
        },
        {
          label: "Sales",
          data: calculateBarData(orders, year, "completed"),
          backgroundColor: "#fff566",
        },
        {
          label: "Orders",
          data: calculateBarData(orders, year, "all"),
          backgroundColor: "#87e8de",
        },
      ],
    });

    setLineData({
      labels,
      datasets: [
        {
          fill: true,
          label: "Revenue",
          data: calculateLineData(orders, year),
          borderColor: "#d3f261",
          backgroundColor: "#f4ffb8",
          tension: 0.3,
        },
      ],
    });
  }, [orders, year]);

  return (
    <Card>
      <Row gutter={[32, 32]}>
        <Col span={4}>
          <Statistic title="Total Orders" value={orders.length} />
        </Col>
        <Col span={4}>
          <Statistic
            title="Today's Orders"
            value={
              orders.filter((o) => moment(o.createdAt).isSame(moment(), "date"))
                .length
            }
          />
        </Col>
        <Col span={4}>
          <Statistic
            title="Total Canceled Orders"
            value={
              orders.filter(
                (o) => o.status === "Canceled" || o.status === "Return/Refund"
              ).length
            }
          />
        </Col>
        <Col span={4}>
          <Statistic
            title="Total Sales"
            value={orders.filter((o) => o.status === "Completed").length}
          />
        </Col>
        <Col span={4}>
          <Statistic
            title="Total Revenue"
            value={moneyFormatter.format(
              orders.reduce((acc, cur) => {
                if (cur.status === "Completed") {
                  acc += cur.totalPayment;
                }
                return acc;
              }, 0)
            )}
          />
        </Col>

        <Col span={24}>
          <Select
            defaultValue={year}
            style={{
              width: 120,
            }}
            onChange={(value) => setYear(value)}
            options={Array.from([0, 1, 2], (x) => ({
              label: initialYear - x,
              value: (initialYear - x).toString(),
            }))}
          />
        </Col>
        <Col span={12}>
          <Bar options={barOptions} data={barData} />
        </Col>

        <Col span={12}>
          <Line options={lineOptions} data={lineData} />
        </Col>
      </Row>
    </Card>
  );
}

export default OrderStatistics;
