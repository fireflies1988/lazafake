import {
  Button,
  Card,
  Image,
  Radio,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import React, { useState } from "react";
import { ImLocation } from "react-icons/im";

const { Text } = Typography;

const columns = [
  {
    title: "Products Ordered",
    dataIndex: "product",
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

const data = [];
for (let i = 0; i < 3; i++) {
  data.push({
    key: i,
    product: (
      <>
        <Image
          width={100}
          src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        />
        &nbsp;&nbsp;Product Name
      </>
    ),
    price: 10000,
    quantity: 3,
    itemSubtotal: 200000,
  });
}

function Checkout() {
  const [value, setValue] = useState("Cash");
  const onChange = (e) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };

  return (
    <Space direction="vertical" style={{ display: "flex" }} size="large">
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
          <Button type="primary" ghost>
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
          <span>
            Kiều Huỳnh Thanh Tùng (+84) 965939861 97 Màn Thiện, Phường Hiệp Phú,
            Thành Phố Thủ Đức, TP. Hồ Chí Minh
          </span>
          <Tag color="green">Default</Tag>
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
                <Text>Shipping Fee:</Text>
                <Text>30000d</Text>
              </Space>
              <Space
                style={{ width: "300px", justifyContent: "space-between" }}
              >
                <Text>Order Total:</Text>
                <Text strong type="danger">
                  600000d
                </Text>
              </Space>
            </Space>
          )}
        />
      </Space>

      <Card title="Vouchers" style={{ borderRadius: 0 }} extra={<Button type="primary" ghost>Select Voucher</Button>}>
        
      </Card>

      <Card title="Payment Method" style={{ borderRadius: 0 }}>
        <Radio.Group onChange={onChange} value={value}>
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
            <Text>30000</Text>
          </Space>
          <Space style={{ width: "300px", justifyContent: "space-between" }}>
            <Text>Shipping Total:</Text>
            <Text>60000</Text>
          </Space>
          <Space style={{ width: "300px", justifyContent: "space-between" }}>
            <Text>Voucher:</Text>
            <Text>-30000</Text>
          </Space>
          <Space style={{ width: "300px", justifyContent: "space-between" }}>
            <Text strong style={{ fontSize: "18px" }}>
              Total Payment:
            </Text>
            <Text strong type="danger" style={{ fontSize: "18px" }}>
              30000000
            </Text>
          </Space>

          <Button type="primary" style={{ width: "200px", marginTop: "0.5rem" }} size="large">Place Order</Button>
        </Space>
      </Card>
    </Space>
  );
}

export default Checkout;
