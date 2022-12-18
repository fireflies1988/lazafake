import { Button, Form, Modal, Popconfirm, Select, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsersAsync } from "../../features/auth/authSlice";
import { updateOrderStatusAsync } from "../../features/order/orderSlice";

function ChooseShipperModal({ open, onCancel, orderId, type }) {
  const [form] = Form.useForm();
  const { users, isLoading: loadingUsers } = useSelector((state) => state.auth);
  const {
    orders,
    isLoading: loadingOrders,
    isSuccess,
  } = useSelector((state) => state.order);
  const dispatch = useDispatch();
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (type === "admin") {
      dispatch(getUsersAsync({ role: "shipper" }));
    }
  }, []);

  useEffect(() => {
    console.log(orders);
    setOptions(
      users.map((u) => ({
        value: u?._id,
        label: `${u?.fullName} (${u?.email}), delivering: ${
          orders.filter(
            (o) =>
              o?.shipper?._id === u?._id &&
              (o?.status === "To Ship" || o?.status === "To Receive")
          ).length
        }`,
      }))
    );
  }, [users, orders]);

  useEffect(() => {
    if (isSuccess) {
      onCancel();
    }
  }, [isSuccess]);

  return (
    <Modal
      open={open}
      title="Choose Shipper"
      closable={false}
      footer={[
        <Button
          onClick={() => {
            onCancel();
          }}
        >
          Cancel
        </Button>,
        <Popconfirm
          placement="bottomRight"
          title="Are you sure about this?"
          onConfirm={() => {
            form
              .validateFields()
              .then((values) => {
                dispatch(
                  updateOrderStatusAsync({
                    orderId,
                    status: "To Ship",
                    shipper: values.shipper,
                  })
                );
              })
              .catch((info) => {
                console.log("Validate Failed:", info);
              });
          }}
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary" loading={loadingOrders}>
            Confirm
          </Button>
        </Popconfirm>,
      ]}
    >
      <Spin spinning={loadingUsers}>
        <Form form={form} layout="vertical">
          <Form.Item
            name="shipper"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select options={options} loading={loadingUsers} />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
}

export default ChooseShipperModal;
