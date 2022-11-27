import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Image,
  Space,
  Table,
  message as antMessage,
  Popconfirm,
} from "antd";
import React, { useState } from "react";
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

function Categories() {
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const { categories, isError, isSuccess, message } = useSelector(
    (state) => state.category
  );
  const [categoryId, setCategoryId] = useState();
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Thumbnail",
      dataIndex: "thumbnail",
      key: "thumbnail",
      render: (_, { thumbnail }) => <Image width={150} src={thumbnail} />,
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
        name: categories[i].name,
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
      <Table columns={columns} dataSource={data} pagination={false} />
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
