import {
  Button,
  Form,
  Image,
  Input,
  InputNumber,
  message as antMessage,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  DatePicker,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductsAsync,
  reset as resetProductState,
} from "../../features/product/productSlice";
import {
  addPromotionAsync,
  editPromotionAsync,
} from "../../features/promotion/promotionSlice";
import { moneyFormatter, showError } from "../../utils";
import dayjs from "dayjs";
const { RangePicker } = DatePicker;

function PromotionModal({ open, onCancel, record, type }) {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [previousSelect, setPreviousSelect] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectValues, setSelectValues] = useState([]);

  const {
    products,
    isError: productError,
    message: productMessage,
    isLoading: loadingProducts,
  } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const { isSuccess, message, isLoading } = useSelector(
    (state) => state.promotion
  );

  useEffect(() => {
    if (type === "edit") {
      setSelectValues(record.products.map((p) => p.product._id));
      setPreviousSelect(record.products.map((p) => p.product._id));
      setData(
        record.products.map((p) => ({
          productId: p?.product?._id,
          thumbnail:
            p?.product?.images?.length > 0 ? p?.product?.images[0]?.url : "",
          name: p?.product?.name,
          stock: p?.product?.quantity,
          price: p?.product?.price,
          discount: p?.discount,
          priceAfterDiscount: p?.product?.price - p?.discount,
        }))
      );
      form.setFieldsValue({
        name: record.name,
        note: record.note,
        time: [dayjs(record.from), dayjs(record.to)],
      });
    }

    if (type === "add") {
      form.resetFields();
      setSelectValues([]);
      setPreviousSelect([]);
      setData([]);
    }
  }, [open, record]);

  useEffect(() => {
    dispatch(getProductsAsync({ listed: true }));
  }, []);

  useEffect(() => {
    if (productError) {
      showError(antMessage, productMessage);
    }

    if (isSuccess) {
      if (type === "add") {
        form.resetFields();
        setSelectValues([]);
        setPreviousSelect([]);
        setData([]);
        onCancel();
      }
    }

    dispatch(resetProductState());
  }, [productError, isSuccess]);

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
      render: (_, record) => moneyFormatter.format(record.price),
    },
    {
      title: "Discount Amount",
      dataIndex: "discount",
      render: (_, record) => (
        <InputNumber
          min={1}
          max={record.price - 1}
          value={record.discount}
          addonAfter="VND"
          onChange={(value) => {
            setData(
              data.map((d) => {
                if (d.productId === record.productId) {
                  d.discount = value;
                  d.priceAfterDiscount = d.price - d.discount;
                }
                return d;
              })
            );
          }}
        />
      ),
    },
    {
      title: "Price After Discount",
      dataIndex: "priceAfterDiscount",
      render: (_, record) => moneyFormatter.format(record.priceAfterDiscount),
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
            stock: p?.quantity,
            price: p?.price,
            discount: 0,
            priceAfterDiscount: p?.price,
          })),
      ]);
    } else {
      // remove
      productId = previousSelect.filter((p) => !values.includes(p))[0];
      setData(data.filter((d) => d.productId !== productId));
    }
    setPreviousSelect(values);
  };

  return (
    <Modal
      open={open}
      title={type === "add" ? "Add Promotion" : "Edit Promotion"}
      closable={false}
      centered
      width={1200}
      footer={[
        <Button
          onClick={() => {
            form.resetFields();
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
          title="Are you sure to add this promotion?"
          onConfirm={() => {
            form
              .validateFields()
              .then((values) => {
                console.log("Add Promotion form: ", values);

                if (type === "add") {
                  dispatch(
                    addPromotionAsync({
                      name: values.name,
                      note: values.note,
                      from: values.time[0].toISOString(),
                      to: values.time[1].toISOString(),
                      products: data.map((d) => ({
                        product: d.productId,
                        discount: d.discount,
                      })),
                    })
                  );
                }

                if (type === "edit") {
                  dispatch(
                    editPromotionAsync({
                      promotionId: record.promotionId,
                      name: values.name,
                      note: values.note,
                      from: values.time[0].toISOString(),
                      to: values.time[1].toISOString(),
                      products: data.map((d) => ({
                        product: d.productId,
                        discount: d.discount,
                      })),
                    })
                  );
                }
              })
              .catch((info) => {
                console.log("Validate Failed:", info);
              });
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
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
        />
        <br />
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          style={{ width: "600px" }}
          form={form}
          initialValues={{
            note: "Khuyến mãi này có thể kết thúc sớm hơn dự kiến nếu vượt quá ngân sách.",
          }}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input promotion name!",
                whitespace: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Time Range"
            name="time"
            rules={[
              {
                type: "array",
                required: true,
                message: "Please select time!",
              },
            ]}
          >
            <RangePicker showTime />
          </Form.Item>
          <Form.Item label="Note" name="note">
            <TextArea showCount maxLength={200} rows={3} />
          </Form.Item>
        </Form>
        <Table columns={columns} dataSource={data} pagination={false} />
      </Space>
    </Modal>
  );
}

export default PromotionModal;
