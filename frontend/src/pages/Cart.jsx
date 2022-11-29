import {
  Button,
  Card,
  Image,
  InputNumber,
  Space,
  Spin,
  Table,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  changeQtyAsync,
  removeFromCartAsync,
  removeMultipleFromCartAsync,
} from "../features/cart/cartSlice";
import { moneyFormatter, reverseMoneyFormattedText } from "../utils";
const { Text } = Typography;

function Cart() {
  const { cartItems, isLoading } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [disabled, setDisabled] = useState(true);
  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);

    if (newSelectedRowKeys.length > 0) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  };

  function removeSelectedItems() {
    dispatch(removeMultipleFromCartAsync(selectedRowKeys));
    setSelectedRowKeys([]);
  }

  const columns = [
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
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      render: (_, record) => (
        <InputNumber
          min={1}
          defaultValue={record?.quantity}
          max={record?.productQuantity}
          onChange={(value) => {
            if (value) {
              dispatch(
                changeQtyAsync({ cartItemId: record._id, quantity: value })
              );
            }
          }}
        />
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
        >
          Delete
        </Button>
      ),
    },
  ];
  const [data, setData] = useState();

  useEffect(() => {
    const tempData = [];
    for (let i = 0; i < cartItems.length; i++) {
      tempData.push({
        key: cartItems[i]._id,
        _id: cartItems[i]._id,
        thumbnail:
          cartItems[i]?.product?.images?.length > 0
            ? cartItems[i]?.product?.images[0]?.url
            : "",
        name: cartItems[i].product?.name,
        price: moneyFormatter.format(cartItems[i].product?.price),
        quantity: cartItems[i].quantity,
        productQuantity: cartItems[i].product.quantity,
        totalPrice: moneyFormatter.format(
          cartItems[i].quantity * cartItems[i].product?.price
        ),
      });
    }
    setData(tempData);
  }, [cartItems]);

  console.log("CartItems", cartItems);

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <Card
      title="My Shopping Cart"
      extra={
        <Space size="large">
          {selectedRowKeys?.length > 0 && (
            <Text strong type="danger" style={{ fontSize: "16px" }}>
              Total ({selectedRowKeys.length} items):{" "}
              {data.reduce((sum, object) => {
                if (selectedRowKeys.includes(object.key)) {
                  sum += reverseMoneyFormattedText(object.totalPrice);
                }
                return sum;
              }, 0)}
              đ{" "}
            </Text>
          )}

          <Button
            type="primary"
            ghost
            disabled={disabled}
            onClick={() => navigate("/checkout")}
          >
            Check Out
          </Button>
        </Space>
      }
    >
      <Space
        style={{
          marginBottom: 16,
        }}
      >
        <Button disabled={disabled} onClick={removeSelectedItems}>
          Remove Selected Items
        </Button>
      </Space>
      <Spin spinning={isLoading}>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
          pagination={false}
        />
      </Spin>
    </Card>
  );
}

export default Cart;
