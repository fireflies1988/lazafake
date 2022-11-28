import { Button, Card, Image, InputNumber, Table } from "antd";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { removeFromCartAsync } from "../features/cart/cartSlice";

function Cart() {
  const { cart, isLoading } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const columns = [
    {
      title: "Thumbnail",
      dataIndex: "thumbnail",
      render: (_, record) => <Image width={100} src={record.thumbnail} />,
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Unit Price",
      dataIndex: "price",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      render: (_, record) => (
        <InputNumber min={1} defaultValue={record.quantity} />
      ),
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          ghost
          size="small"
          danger
          onClick={() => {
            dispatch(removeFromCartAsync(record._id));
          }}
          loading={isLoading}
        >
          Delete
        </Button>
      ),
    },
  ];
  const [data, setData] = useState();

  useEffect(() => {
    const tempData = [];
    for (let i = 0; i < cart.length; i++) {
      tempData.push({
        key: cart[i]._id,
        _id: cart[i]._id,
        thumbnail:
          cart[i]?.product?.images?.length > 0
            ? cart[i]?.product?.images[0]?.url
            : "",
        name: cart[i].product?.name,
        price: `${cart[i].product?.price}`,
        quantity: cart[i].quantity,
        totalPrice: `${cart[i].quantity * cart[i].product?.price}đ`,
      });
    }
    setData(tempData);
  }, [cart]);

  console.log(cart);

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
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={data}
        pagination={false}
      />
    </Card>
  );
}

export default Cart;
