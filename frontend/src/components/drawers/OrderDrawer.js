import GoogleMap from "../GoogleMap";
import {
  Button,
  Descriptions,
  Drawer,
  Popconfirm,
  Space,
  Steps,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateOrderStatusAsync } from "../../features/order/orderSlice";
import { cancelOrderAsync } from "../../features/auth/authSlice";
import ChooseShipperModal from "../modals/ChooseShipperModal";
const { Text } = Typography;

const statuses = [
  "To Pay",
  "To Ship",
  "To Receive",
  "Completed",
  "Canceled",
  "Return/Refund",
];

function OrderDrawer({ onClose, open, orderId, type }) {
  const [current, setCurrent] = useState(0);
  const [status, setStatus] = useState("process");
  const [disabled, setDisabled] = useState(false);
  const [orderData, setOrderData] = useState();
  const [address, setAddress] = useState("");
  const [openChooseShipper, setOpenChooseShipper] = useState(false);

  const dispatch = useDispatch();
  const { orders: allOrders, isLoading: loadingAllOrders } = useSelector(
    (state) => state.order
  );
  const { orders: myOrders, isLoading: loadingMyOrders } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (type === "admin") {
      setOrderData(allOrders.find((order) => order._id === orderId));
    } else if (type === "user") {
      setOrderData(myOrders.find((order) => order._id === orderId));
    }
  }, [orderId, allOrders, myOrders, open]);

  useEffect(() => {
    setAddress(
      `${orderData?.shippingAddress?.address}, ${orderData?.shippingAddress?.ward}, ${orderData?.shippingAddress?.district}, ${orderData?.shippingAddress?.province}`
    );

    if (orderData?.status === "To Pay") {
      setCurrent(1);
    } else if (orderData?.status === "To Ship") {
      setCurrent(2);
    } else if (orderData?.status === "To Receive") {
      setCurrent(3);
    } else if (orderData?.status === "Completed") {
      setCurrent(4);
      setStatus("finish");
    } else if (
      orderData?.status === "Canceled" ||
      orderData?.status === "Return/Refund"
    ) {
      if (!orderData?.confirmedAt) {
        setCurrent(1);
        setStatus("error");
      } else if (!orderData?.shippedOutAt) {
        setCurrent(2);
        setStatus("error");
      } else if (!orderData?.completedAt) {
        setCurrent(3);
        setStatus("error");
      }
    }

    if (
      orderData?.status === "Canceled" ||
      orderData?.status === "Completed" ||
      orderData?.status === "Return/Refund"
    ) {
      setDisabled(true);
    } else {
      setDisabled(false);
      setStatus("process");
    }
  }, [orderData]);

  return (
    <Drawer
      title="Order Details"
      placement="left"
      onClose={onClose}
      open={open}
      width={700}
    >
      <Space direction="vertical" style={{ display: "flex" }}>
        <Steps
          direction="vertical"
          size="small"
          current={current}
          status={status}
          items={[
            {
              title: "Order Placed",
              description: orderData?.createdAt,
            },
            {
              title: "Order Confirmed",
              description: orderData?.confirmedAt,
            },
            {
              title: "Order Shipped Out",
              description: orderData?.shippedOutAt,
            },
            {
              title: "Order Received",
              description: "",
            },
            {
              title: "Order Completed",
              description: orderData?.completedAt,
            },
          ]}
        />

        <Descriptions column={1} bordered>
          <Descriptions.Item label="Order Status">
            {orderData?.status}
          </Descriptions.Item>
          <Descriptions.Item label="Shipping Address">
            {address}
          </Descriptions.Item>
          {(orderData?.status === "Canceled" ||
            orderData?.status === "Return/Refund") && (
            <Descriptions.Item label="Canceled At">
              {orderData?.canceledAt ?? orderData?.returnAt ?? ""}
            </Descriptions.Item>
          )}
          {orderData?.shipper && (
            <Descriptions.Item label="Shipper">
              {orderData?.shipper?.fullName} ({orderData?.shipper?.email})
            </Descriptions.Item>
          )}
        </Descriptions>

        <GoogleMap
          style={{
            border: 0,
            width: "100%",
            height: "400px",
          }}
          address={address}
        />

        {type === "admin" && (
          <Space>
            {orderData?.status === "To Pay" ? (
              <Button
                type="primary"
                ghost
                loading={loadingAllOrders}
                disabled={disabled}
                onClick={() => {
                  setOpenChooseShipper(true);
                }}
              >
                Next State
              </Button>
            ) : (
              <Popconfirm
                title="Are you sure to update this order status?"
                onConfirm={() =>
                  dispatch(
                    updateOrderStatusAsync({
                      orderId: orderData._id,
                      status: statuses[statuses.indexOf(orderData?.status) + 1],
                    })
                  )
                }
                placement="topLeft"
                okText="Yes"
                cancelText="No"
                disabled={disabled}
              >
                <Button
                  type="primary"
                  ghost
                  loading={loadingAllOrders}
                  disabled={disabled}
                >
                  Next State
                </Button>
              </Popconfirm>
            )}

            <Popconfirm
              placement="topLeft"
              title="Are you sure to cancel this order?"
              onConfirm={() =>
                dispatch(
                  updateOrderStatusAsync({
                    orderId: orderData._id,
                    status: "Canceled",
                  })
                )
              }
              okText="Yes"
              cancelText="No"
              disabled={disabled}
            >
              <Button
                type="primary"
                ghost
                danger
                loading={loadingAllOrders}
                disabled={disabled}
              >
                Cancel Order
              </Button>
            </Popconfirm>
          </Space>
        )}

        {type === "user" && (
          <Popconfirm
            placement="topLeft"
            title="Are you sure to cancel this order?"
            onConfirm={() =>
              dispatch(
                cancelOrderAsync({
                  orderId: orderData._id,
                  cancellationReason: "",
                })
              )
            }
            okText="Yes"
            cancelText="No"
            disabled={
              orderData?.status !== "To Ship" && orderData?.status !== "To Pay"
            }
          >
            <Button
              type="primary"
              ghost
              danger
              loading={loadingMyOrders}
              disabled={
                orderData?.status !== "To Ship" &&
                orderData?.status !== "To Pay"
              }
            >
              Cancel Order
            </Button>
          </Popconfirm>
        )}
      </Space>

      <ChooseShipperModal
        open={openChooseShipper}
        onCancel={() => setOpenChooseShipper(false)}
        orderId={orderId}
        type={type}
      />
    </Drawer>
  );
}

export default OrderDrawer;
