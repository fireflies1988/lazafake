import { SearchOutlined } from "@ant-design/icons";
import {
  Card,
  Spin,
  Table,
  message as antMessage,
  Input,
  Button,
  Space,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsersAsync, reset } from "../../features/auth/authSlice";
import { showError } from "../../utils";
import moment from "moment";
import Highlighter from "react-highlight-words";
import ChangeRoleModal from "../../components/modals/ChangeRoleModal";

function Users() {
  const [data, setData] = useState([]);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { users, isError, isSuccess, isLoading, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    dispatch(getUsersAsync());
  }, []);

  useEffect(() => {
    if (isError) {
      showError(antMessage, message);
    }

    if (isSuccess) {
      antMessage.success(message);
    }

    return () => dispatch(reset());
  }, [isError, isSuccess]);

  // ---- filter orderId
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const [open, setOpen] = useState(false);
  const [role, setRole] = useState("");
  const [userId, setUserId] = useState();

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

  // ---- filter
  const [filteredInfo, setFilteredInfo] = useState({});
  const handleChange = (pagination, filters, sorter) => {
    console.log("Various parameters", pagination, filters, sorter);
    setFilteredInfo(filters);
  };
  // ----

  const columns = [
    {
      title: "ID",
      dataIndex: "userId",
      key: "userId",
      fixed: "left",
      ...getColumnSearchProps("userId"),
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      ...getColumnSearchProps("fullName"),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ...getColumnSearchProps("email"),
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      ...getColumnSearchProps("phoneNumber"),
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      filters: [
        {
          text: "Other",
          value: "Other",
        },
        {
          text: "Male",
          value: "Male",
        },
        {
          text: "Female",
          value: "Female",
        },
      ],
      filterValue: filteredInfo.gender || null,
      onFilter: (value, record) => record.gender.includes(value),
    },
    {
      title: "Date Of Birth",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
    },
    {
      title: "Joined At",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      render: (_, record) => (
        <>
          {user?.role === "spadmin" && record.role !== "spadmin" && (
            <Space>
              <Button
                type="link"
                ghost
                size="small"
                onClick={() => {
                  setOpen(true);
                  setRole(record.role);
                  setUserId(record.userId);
                }}
              >
                Change Role
              </Button>
            </Space>
          )}{" "}
        </>
      ),
    },
  ];

  useEffect(() => {
    const tempData = [];
    for (let i = 0; i < users.length; i++) {
      tempData.push({
        key: i,
        _id: users[i]._id,
        userId: users[i]._id,
        fullName: users[i].fullName,
        email: users[i].email,
        phoneNumber: users[i]?.phoneNumber,
        gender: users[i].gender,
        dateOfBirth: users[i]?.dateOfBirth,
        createdAt: users[i].createdAt,
        role: users[i].role,
      });
    }
    setData(tempData);
  }, [users]);

  return (
    <Card title="User List">
      <Spin spinning={isLoading}>
        <Table
          columns={columns}
          dataSource={data}
          onChange={handleChange}
          scroll={{ x: 1500 }}
        />
      </Spin>
      <ChangeRoleModal
        open={open}
        onCancel={() => setOpen(false)}
        userId={userId}
        role={role}
      />
    </Card>
  );
}

export default Users;
