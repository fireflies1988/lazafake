import { Button, Form, InputNumber, Modal, Popconfirm } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  changeProductPriceAsync,
  reset,
} from "../../features/product/productSlice";

function ChangePriceModal({ open, onCancel, productId, price }) {
  const [form] = Form.useForm();
  const { isSuccess, isLoading } = useSelector((state) => state.product);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isSuccess) {
      form.resetFields();
      onCancel();
    }

    dispatch(reset());
  }, [isSuccess]);

  useEffect(() => {
    form.setFieldsValue({ oldPrice: price });
  }, [open, price, productId]);

  return (
    <Modal
      open={open}
      title="Change Product Price"
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
          title="Are you sure to change this product price?"
          onConfirm={() => {
            form
              .validateFields()
              .then((values) => {
                dispatch(
                  changeProductPriceAsync({
                    productId,
                    newPrice: values.newPrice,
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
          <Button type="primary" loading={isLoading}>
            Save
          </Button>
        </Popconfirm>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="oldPrice" label="Old Price">
          <InputNumber addonAfter="VNĐ" disabled />
        </Form.Item>

        <Form.Item
          name="newPrice"
          label="New Price"
          rules={[
            {
              required: true,
              message: "Please input the new price!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || value !== getFieldValue("oldPrice")) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(
                    "The New Price must be different from the Old Price!"
                  )
                );
              },
            }),
          ]}
        >
          <InputNumber addonAfter="VNĐ" min={1000} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default ChangePriceModal;
