import { Button, Form, InputNumber, Modal, Popconfirm } from "antd";
import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductsAsync,
  listProductAsync,
} from "../../features/product/productSlice";

function ListProductModal({ open, onCancel, productId }) {
  const [form] = Form.useForm();
  const { isSuccess, isLoading } = useSelector((state) => state.product);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isSuccess) {
      dispatch(getProductsAsync({ listed: false }));
      form.resetFields();
      onCancel();
    }
  }, [isSuccess]);

  return (
    <Modal
      open={open}
      title="List Product"
      closable={false}
      footer={[
        <Button
          onClick={() => {
            form.resetFields();
            onCancel();
          }}
        >
          Cancel
        </Button>,
        <Popconfirm
          placement="bottomRight"
          title="Are you sure to list this product?"
          onConfirm={() => {
            form
              .validateFields()
              .then((values) => {
                dispatch(listProductAsync({ productId, price: values.price }));
              })
              .catch((info) => {
                console.log("Validate Failed:", info);
              });
          }}
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary" loading={isLoading}>
            List
          </Button>
        </Popconfirm>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="price"
          label="Listing Price"
          rules={[
            {
              required: true,
              message: "Please input the listing price!",
            },
          ]}
        >
          <InputNumber addonAfter="VNĐ" min={1000} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default ListProductModal;
