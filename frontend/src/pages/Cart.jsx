import { Button, Card, Image, InputNumber, Table } from "antd";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const columns = [
  {
    title: "Product",
    dataIndex: "product",
  },
  {
    title: "Unit Price",
    dataIndex: "price",
  },
  {
    title: "Quantity",
    dataIndex: "quantity",
  },
  {
    title: "Total Price",
    dataIndex: "totalPrice",
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Button type="primary" ghost size="small" danger>
        Delete
      </Button>
    ),
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
    quantity: <InputNumber min={1} defaultValue={1} />,
    totalPrice: 200000,
  });
}

function Cart() {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <Card
      title="My Shopping Cart"
      extra={
        <Button type="primary" ghost>
          <Link to="/checkout">Check Out</Link>
        </Button>
      }
    >
      <Table rowSelection={rowSelection} columns={columns} dataSource={data} pagination={false}/>
    </Card>
  );
}

export default Cart;
