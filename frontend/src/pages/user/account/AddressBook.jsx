import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  message as antMessage,
  Popconfirm,
  Space,
  Spin,
  Table,
  Tag,
} from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CardTitle from "../../../components/CartTitle";
import AddAddressModal from "../../../components/modals/AddAddressModal";
import EditAddressModal from "../../../components/modals/EditAddressModal";
import {
  resetState,
  getAddressesAsync,
  deleteAddressAsync,
} from "../../../features/address/addressSlice";
import { showError } from "../../../utils";

function AddressBook() {
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [addressId, setAddressId] = useState();
  const { addresses, isError, isSuccess, isLoading, message } = useSelector(
    (state) => state.address
  );

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Street Name, Building, House No.",
      dataIndex: "address1",
      key: "address1",
    },
    {
      title: "City, District, Ward",
      dataIndex: "address2",
      key: "address2",
    },
    {
      title: "Label",
      key: "label",
      dataIndex: "label",
      render: (_, { isDefault, label }) => (
        <>
          {isDefault && <Tag color="green">Default</Tag>}
          {label === "Home" && <Tag color="red">Home</Tag>}
          {label === "Work" && <Tag color="blue">Work</Tag>}
          {label === "Other" && <Tag color="gold">Other</Tag>}
        </>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, { isDefault, id }) => (
        <Space>
          <Button
            type="primary"
            ghost
            size="small"
            onClick={() => {
              setAddressId(id);
              setOpenEdit(true);
            }}
          >
            Edit
          </Button>
          {!isDefault && (
            <Popconfirm
              placement="topLeft"
              title="Are you sure you want to delete this address?"
              onConfirm={() => onDelete(id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary" danger size="small">
                Delete
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  const [data, setData] = useState([]);
  const dispatch = useDispatch();

  function onDelete(id) {
    dispatch(deleteAddressAsync(id));
  }

  useEffect(() => {
    const tempData = [];
    for (let i = 0; i < addresses.length; i++) {
      tempData.push({
        key: i,
        id: addresses[i]._id,
        fullName: addresses[i].fullName,
        phoneNumber: addresses[i].phoneNumber,
        address1: addresses[i].address,
        address2:
          addresses[i].ward +
          ", " +
          addresses[i].district +
          ", " +
          addresses[i].province,
        label: addresses[i].label,
        isDefault: addresses[i].isDefault,
      });
    }
    setData(tempData);
  }, [addresses]);

  useEffect(() => {
    dispatch(getAddressesAsync());
  }, []);

  useEffect(() => {
    if (isError) {
      showError(antMessage, message);
    }

    if (isSuccess) {
      antMessage.success(message);
    }

    return () => dispatch(resetState());
  }, [isError, isSuccess]);

  return (
    <Card
      title={<CardTitle title="Address Book" />}
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setOpenAdd(true);
          }}
        >
          Add New Address
        </Button>
      }
    >
      <Spin spinning={isLoading}>
        <Table
          columns={columns.filter((col) => col.dataIndex !== "id")}
          dataSource={data}
          pagination={false}
        />
      </Spin>
      <AddAddressModal
        open={openAdd}
        onCancel={() => {
          setOpenAdd(false);
        }}
      />
      <EditAddressModal
        open={openEdit}
        onCancel={() => {
          setOpenEdit(false);
        }}
        addressId={addressId}
      />
    </Card>
  );
}

export default AddressBook;
