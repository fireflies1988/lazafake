import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Image,
  Space,
  Table,
  message as antMessage,
  Popconfirm,
  Input,
} from "antd";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddCategoryModal from "../../components/modals/AddCategoryModal";
import EditCategoryModal from "../../components/modals/EditCategoryModal";
import {
  deleteCategoryAsync,
  getCategoriesAsync,
  reset,
} from "../../features/category/categorySlice";
import { showError } from "../../utils";
import Highlighter from "react-highlight-words";
import moment from "moment";

function Categories() {
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const { categories, isError, isSuccess, message } = useSelector(
    (state) => state.category
  );
  const [categoryId, setCategoryId] = useState();

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

  const columns = [
    {
      title: "ID",
      dataIndex: "categoryId",
      key: "categoryId",
      ...getColumnSearchProps("categoryId"),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Thumbnail",
      dataIndex: "thumbnail",
      key: "thumbnail",
      render: (_, { thumbnail }) => <Image width={50} src={thumbnail} />,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            ghost
            size="small"
            onClick={() => {
              setCategoryId(record._id);
              setOpenEdit(true);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            placement="topLeft"
            title="Are you sure you want to delete this address?"
            onConfirm={() => dispatch(deleteCategoryAsync(record._id))}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger size="small">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const [data, setData] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCategoriesAsync());
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

  useEffect(() => {
    const tempData = [];
    for (let i = 0; i < categories.length; i++) {
      tempData.push({
        key: i,
        _id: categories[i]._id,
        categoryId: categories[i]._id,
        name: categories[i].name,
        createdAt: categories[i].createdAt,
        thumbnail: categories[i]?.thumbnail?.url,
      });
    }
    setData(tempData);
  }, [categories]);

  return (
    <Card
      title="Category List"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setOpenAdd(true);
          }}
        >
          Add New Category
        </Button>
      }
    >
      <Table columns={columns} dataSource={data} />
      <AddCategoryModal
        open={openAdd}
        onCancel={() => {
          setOpenAdd(false);
        }}
      />
      <EditCategoryModal
        open={openEdit}
        onCancel={() => {
          setOpenEdit(false);
        }}
        categoryId={categoryId}
      />
    </Card>
  );
}

export default Categories;
