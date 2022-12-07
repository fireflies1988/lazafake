import {
  Button,
  Card,
  Empty,
  Image,
  Radio,
  Space,
  Table,
  Tag,
  Typography,
  message as antMessage,
} from "antd";
import React, { useEffect, useState } from "react";
import { ImLocation } from "react-icons/im";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import ChooseAddressModal from "../components/modals/ChooseAddressModal";
import { getAddressesAsync } from "../features/address/addressSlice";
import { placeOrderAsync, reset } from "../features/order/orderSlice";
import { moneyFormatter, reverseMoneyFormattedText, showError } from "../utils";

const { Text } = Typography;
const DEFAULT_SHIPPING_FEE = 30000;

const columns = [
  {
    title: "Product ID",
    dataIndex: "productId",
  },
  {
    title: "Thumbnail",
    dataIndex: "thumbnail",
    render: (_, record) => <Image width={100} src={record?.thumbnail} />,
  },
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: "Unit Price",
    dataIndex: "price",
    align: "right",
  },
  {
    title: "Quantity",
    dataIndex: "quantity",
    align: "right",
  },
  {
    title: "Item Subtotal",
    dataIndex: "itemSubtotal",
    align: "right",
  },
];

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderItems, setOrderItems] = useState(location.state);
  const [data, setData] = useState([]);

  const dispatch = useDispatch();
  const { addresses } = useSelector((state) => state.address);
  const { user } = useSelector((state) => state.auth);
  const { message, isError, isSuccess, isLoading, paypalUrl } = useSelector(
    (state) => state.order
  );

  // choose address modal
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState();

  const [address, setAddress] = useState();
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [subtotal, setSubtotal] = useState(0);
  const [shippingFee, setShippingFee] = useState(DEFAULT_SHIPPING_FEE);

  const onChange = (e) => {
    console.log("radio checked: ", e.target.value);
    if (e.target.value === "Cash") {
      setShippingFee(DEFAULT_SHIPPING_FEE);
    } else {
      setShippingFee(0);
    }
    setPaymentMethod(e.target.value);
  };

  console.log("Ordered Products: ", orderItems);
  useEffect(() => {
    // clear location state
    if (location?.state?.message) {
      window.history.replaceState({}, document.title);
    }

    // load addresses
    dispatch(getAddressesAsync());
  }, []);

  useEffect(() => {
    if (isError) {
      showError(antMessage, message);
    }

    if (isSuccess) {
      if (paymentMethod === "Paypal") {
        if (paypalUrl) {
          window.location.href = paypalUrl;
        }
      } else {
        navigate("/result?success");
      }
    }

    dispatch(reset());
  }, [isError, isSuccess]);

  useEffect(() => {
    const address = addresses.find((a) => a.isDefault === true);
    setAddress(address);
    setValue(address?._id);
  }, [addresses]);

  useEffect(() => {
    setAddress(addresses.find((a) => a._id === value));
  }, [value]);

  // load data into table
  useEffect(() => {
    const tempData = [];
    for (let i = 0; i < orderItems.length; i++) {
      tempData.push({
        key: orderItems[i]._id,
        _id: orderItems[i]._id,
        productId: orderItems[i]._id,
        thumbnail:
          orderItems[i]?.product?.images?.length > 0
            ? orderItems[i]?.product?.images[0]?.url
            : "",
        name: orderItems[i].product?.name,
        price: moneyFormatter.format(orderItems[i].product?.price),
        quantity: orderItems[i].quantity,
        itemSubtotal: moneyFormatter.format(
          orderItems[i].quantity * orderItems[i].product?.price
        ),
      });
    }
    setData(tempData);
    setSubtotal(
      tempData?.reduce(
        (sum, object) => sum + reverseMoneyFormattedText(object.itemSubtotal),
        0
      )
    );
  }, [orderItems]);

  function handlePlaceOrder() {
    if (!address) {
      antMessage.error("Please choose an delivery address!");
      return;
    }

    const orderData = {
      shippingAddress: address._id,
      orderItems: orderItems.map((item) => item._id),
      shippingFee: shippingFee,
      paymentMethod: paymentMethod,
    };

    dispatch(placeOrderAsync(orderData));
  }

  return (
    <Space direction="vertical" style={{ display: "flex" }} size="large">
      <ChooseAddressModal
        open={open}
        onCancel={() => setOpen(false)}
        setValue={setValue}
        defaultValue={value}
      />
      <Card
        title={
          <Text
            type="danger"
            style={{
              fontSize: "18px",
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
            }}
          >
            <ImLocation />
            <div>Delivery Address</div>
          </Text>
        }
        extra={
          <Button type="primary" ghost onClick={() => setOpen(true)}>
            Change Address
          </Button>
        }
        style={{ borderRadius: 0 }}
      >
        <Text
          style={{
            fontSize: "16px",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          {address ? (
            <>
              <Text style={{ fontSize: "16px" }}>
                <Text strong style={{ fontSize: "16px" }}>
                  {address?.fullName} | (+84) {address?.phoneNumber}
                </Text>{" "}
                {address?.address}, {address?.ward}, {address?.district},{" "}
                {address?.province}
              </Text>
              {address.isDefault && <Tag color="green">Default</Tag>}
              {address.label === "Home" && <Tag color="red">Home</Tag>}
              {address.label === "Work" && <Tag color="blue">Work</Tag>}
              {address.label === "Other" && <Tag color="gold">Other</Tag>}
            </>
          ) : (
            <Empty />
          )}
        </Text>
      </Card>

      <Space
        direction="vertical"
        style={{ background: "white", padding: "1rem", display: "flex" }}
      >
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          footer={() => (
            <Space
              direction="vertical"
              style={{ display: "flex", alignItems: "flex-end" }}
            >
              <Space
                style={{ width: "300px", justifyContent: "space-between" }}
              >
                <Text>Order Total:</Text>
                <Text strong type="danger">
                  {moneyFormatter.format(subtotal)}
                </Text>
              </Space>
            </Space>
          )}
        />
      </Space>

      <Card
        title="Vouchers"
        style={{ borderRadius: 0 }}
        extra={
          <Button type="primary" ghost>
            Select Voucher
          </Button>
        }
      ></Card>

      <Card title="Payment Method" style={{ borderRadius: 0 }}>
        <Radio.Group onChange={onChange} value={paymentMethod}>
          <Space direction="vertical">
            <Radio value="Cash">Cash On Delivery</Radio>
            <Radio value="Paypal">Paypal</Radio>
          </Space>
        </Radio.Group>
      </Card>

      <Card title="Order Summary" style={{ borderRadius: 0 }}>
        <Space
          direction="vertical"
          style={{ display: "flex", alignItems: "flex-end" }}
        >
          <Space style={{ width: "300px", justifyContent: "space-between" }}>
            <Text>Merchandise Subtotal:</Text>
            <Text>{moneyFormatter.format(subtotal)}</Text>
          </Space>
          <Space style={{ width: "300px", justifyContent: "space-between" }}>
            <Text>Shipping Fee:</Text>
            <Text>{moneyFormatter.format(shippingFee)}</Text>
          </Space>
          <Space style={{ width: "300px", justifyContent: "space-between" }}>
            <Text>Voucher:</Text>
            <Text>0</Text>
          </Space>
          <Space style={{ width: "300px", justifyContent: "space-between" }}>
            <Text strong style={{ fontSize: "18px" }}>
              Total Payment:
            </Text>
            <Text strong type="danger" style={{ fontSize: "18px" }}>
              {moneyFormatter.format(subtotal + shippingFee)}
            </Text>
          </Space>

          <Button
            type="primary"
            style={{ width: "200px", marginTop: "0.5rem" }}
            size="large"
            htmlType="button"
            onClick={handlePlaceOrder}
            loading={isLoading}
          >
            Place Order
          </Button>
        </Space>
      </Card>
    </Space>
  );
}

export default Checkout;
