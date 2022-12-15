import {
  Button,
  Image,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  message as antMessage,
} from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductsAsync,
  reset as resetProductState,
} from "../../features/product/productSlice";
import { addReceiptAsync } from "../../features/receipt/receiptSlice";
import { moneyFormatter, removeAccents, showError } from "../../utils";

function AddReceiptModal({ open, onCancel }) {
  const [data, setData] = useState([]);

  const [selectValues, setSelectValues] = useState([]);
  const [previousSelect, setPreviousSelect] = useState([]);

  const {
    products,
    isError: productError,
    message: productMessage,
    isLoading: loadingProducts,
  } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const { isSuccess, message, isLoading } = useSelector(
    (state) => state.receipt
  );

  const [options, setOptions] = useState([]);

  useEffect(() => {
    dispatch(getProductsAsync());
  }, []);

  useEffect(() => {
    if (productError) {
      showError(antMessage, productMessage);
    }

    dispatch(resetProductState());
  }, [productError]);

  useEffect(() => {
    if (isSuccess) {
      antMessage.success(message);
      setSelectValues([]);
      setPreviousSelect([]);
      setData([]);
      onCancel();
    }
  }, [isSuccess]);

  useEffect(() => {
    const temp = [];
    for (const product of products) {
      temp.push({
        label: `${product.category.name} / ${product._id} / ${product.name}`,
        value: product._id,
      });
    }
    setOptions(temp);
  }, [products]);

  const columns = [
    {
      title: "Product ID",
      dataIndex: "productId",
    },
    {
      title: "Thumbnail",
      dataIndex: "thumbnail",
      render: (_, record) => <Image width={50} src={record?.thumbnail} />,
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Stock",
      dataIndex: "stock",
    },
    {
      title: "Unit Price",
      dataIndex: "price",
      render: (_, record) => (
        <InputNumber
          min={0}
          addonAfter="VND"
          value={record.price}
          onChange={(value) => {
            setData(
              data.map((d) => {
                if (d.productId === record.productId) {
                  d.price = value;
                  d.subtotal = d.price * d.quantity;
                }
                return d;
              })
            );
          }}
        />
      ),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      render: (_, record) => (
        <InputNumber
          min={1}
          value={record.quantity}
          onChange={(value) => {
            setData(
              data.map((d) => {
                if (d.productId === record.productId) {
                  d.quantity = value;
                  d.subtotal = d.price * d.quantity;
                }
                return d;
              })
            );
          }}
        />
      ),
    },
    {
      title: "Subtotal",
      dataIndex: "subtotal",
      render: (_, record) => moneyFormatter.format(record.subtotal),
    },
  ];

  const handleChange = (values) => {
    setSelectValues(values);
    console.log(`selected: ${values}`);
    let productId;
    if (previousSelect.length < values.length) {
      // add
      productId = values.filter((v) => !previousSelect.includes(v))[0];
      setData((data) => [
        ...data,
        ...products
          .filter((p) => p._id === productId)
          .map((p) => ({
            productId: p?._id,
            thumbnail: p?.images?.length > 0 ? p?.images[0]?.url : "",
            name: p?.name,
            price: 0,
            quantity: 100,
            subtotal: 0,
            stock: p?.quantity,
          })),
      ]);
    } else {
      // remove
      productId = previousSelect.filter((p) => !values.includes(p))[0];
      setData(data.filter((d) => d.productId !== productId));
    }
    setPreviousSelect(values);
  };

  console.log(data);

  return (
    <Modal
      open={open}
      title="Add Receipt"
      closable={false}
      centered
      width={1200}
      footer={[
        <Button
          onClick={() => {
            setSelectValues([]);
            setPreviousSelect([]);
            setData([]);
            onCancel();
          }}
        >
          Cancel
        </Button>,
        <Popconfirm
          placement="bottomRight"
          title="Are you sure to save this receipt?"
          onConfirm={() => {
            dispatch(
              addReceiptAsync({
                products: data.map((d) => ({
                  product: d.productId,
                  price: d.price,
                  quantity: d.quantity,
                })),
              })
            );
          }}
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary" loading={isLoading}>
            Save
          </Button>
        </Popconfirm>,
      ]}
    >
      <Space direction="vertical" style={{ display: "flex" }}>
        <Select
          value={selectValues}
          mode="multiple"
          loading={loadingProducts}
          allowClear
          style={{
            width: "100%",
          }}
          placeholder="Please select products"
          onChange={handleChange}
          options={options}
          filterOption={(input, option) =>
            removeAccents(option?.label ?? "")
              .toLowerCase()
              .includes(removeAccents(input).toLowerCase())
          }
        />
        <Table columns={columns} dataSource={data} pagination={false} />
      </Space>
    </Modal>
  );
}

export default AddReceiptModal;
