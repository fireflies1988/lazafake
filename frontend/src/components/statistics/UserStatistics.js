import { Card, Col, Row, Select, Statistic } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsersAsync } from "../../features/auth/authSlice";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
  },
};

// monthly new users
function calculateData(users, year) {
  const res = [];
  console.log(users);
  const data = users.filter((u) => moment(u.createdAt).isSame(year, "year"));
  console.log(data);
  for (let i = 1; i <= 12; i++) {
    res.push(
      data.filter((u) => moment(u.createdAt).format("M") === i.toString())
        .length
    );
  }
  return res;
}

const initialYear = moment().format("Y");

function UserStatistics() {
  const { users } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [year, setYear] = useState(initialYear);
  const [data, setData] = useState({
    labels,
    datasets: [
      {
        label: "Monthly New Users",
        data: [],
        borderColor: "#95de64",
        backgroundColor: "#237804",
        tension: 0.3,
      },
    ],
  });

  useEffect(() => {
    dispatch(getUsersAsync());
  }, []);

  useEffect(() => {
    setData({
      labels,
      datasets: [
        {
          label: "Monthly New Users",
          data: calculateData(users, year),
          borderColor: "#95de64",
          backgroundColor: "#237804",
          tension: 0.3,
        },
      ],
    });
  }, [users, year]);

  return (
    <Card>
      <Row gutter={[16, 32]}>
        <Col span={8}>
          <Statistic title="Total Users" value={users.length} />
        </Col>
        <Col span={8}>
          <Statistic
            title="Verified Users"
            value={users.filter((u) => u.verified).length}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="Today's New Users"
            value={
              users.filter((u) => moment(u.createdAt).isSame(moment())).length
            }
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
          <Line options={options} data={data} />
        </Col>
      </Row>
    </Card>
  );
}

export default UserStatistics;
