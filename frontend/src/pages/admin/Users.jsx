import { Card, Spin, Table, message as antMessage } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsersAsync, reset } from "../../features/auth/authSlice";
import { showError } from "../../utils";

function Users() {
  const [data, setData] = useState([]);

  const dispatch = useDispatch();
  const { users, isError, isLoading, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      showError(antMessage, message);
    }

    return () => dispatch(reset());
  }, [isError]);

  const columns = [
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "dateOfBirth",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
    },
    {
      title: "role",
      dataIndex: "role",
      key: "role",
    },
  ];

  useEffect(() => {
    dispatch(getUsersAsync());
  }, []);

  useEffect(() => {
    const tempData = [];
    for (let i = 0; i < users.length; i++) {
      tempData.push({
        key: i,
        _id: users[i]._id,
        fullName: users[i].fullName,
        email: users[i].email,
        phoneNumber: users[i]?.phoneNumber,
        gender: users[i].gender,
        dateOfBirth: users[i]?.dateOfBirth,
        role: users[i].role,
      });
    }
    setData(tempData);
  }, [users]);

  return (
    <Card title="User List">
      <Spin spinning={isLoading}>
        <Table columns={columns} dataSource={data} pagination={false} />
      </Spin>
    </Card>
  );
}

export default Users;
