import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Drawer,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Upload,
  message,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useState } from "react";
const { Option } = Select;

function ProductDrawer({ open, onClose, title, type }) {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  const uploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        message.error("You can only upload JPG/PNG file!");
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error("Image must smaller than 2MB!");
        return false;
      }

      setFileList([
        ...fileList,
        {
          file: file,
          url: URL.createObjectURL(file),
        },
      ]);
      return false;
    },
    fileList,
    listType: "picture-card",
  };

  return (
    <Drawer
      title={title}
      width={720}
      onClose={onClose}
      open={open}
      placement="left"
      bodyStyle={{
        paddingBottom: 80,
      }}
      maskClosable={false}
      closable={false}
      extra={
        <Space>
          <Button onClick={onClose}>Cancel</Button>
          {type === "update" && <Button danger>Delete</Button>}
          <Button
            onClick={() => {
              form
                .validateFields()
                .then((values) => {
                  form.resetFields();
                  console.log(values);
                })
                .catch((info) => {
                  console.log("Validate Failed:", info);
                });
            }}
            type="primary"
          >
            Save
          </Button>
        </Space>
      }
    >
      <Form
        form={form}
        name="addProduct"
        labelCol={{
          span: 4,
        }}
        wrapperCol={{ span: 20 }}
        scrollToFirstError
      >
        <Form.Item
          name="sku"
          label="SKU"
          rules={[
            {
              required: true,
              message: "Please input product SKU!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="name"
          label="Name"
          rules={[
            {
              required: true,
              message: "Please input product name!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="price"
          label="Price"
          rules={[
            {
              required: true,
              message: "Please input product price!",
            },
          ]}
        >
          <InputNumber addonAfter="VNĐ" />
        </Form.Item>

        <Form.Item
          name="quantity"
          label="Quantity"
          rules={[
            {
              required: true,
              message: "Please input product quantity!",
            },
          ]}
        >
          <InputNumber min={1} />
        </Form.Item>

        <Form.Item name="category" label="Category">
          <Select placeholder="Please select a category" allowClear>
            <Option value="Mouse">Mouse</Option>
            <Option value="CPU">CPU</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[
            {
              required: true,
              message: "Please input product description!",
            },
          ]}
        >
          <TextArea showCount maxLength={2000} rows={5} />
        </Form.Item>

        <Form.Item name="images" label="Images">
          <Upload {...uploadProps}>
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </Upload>
        </Form.Item>

        <Form.Item name="specifications" label="Specifications">
          <Form.List name="specifications">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{
                      display: "flex",
                      marginBottom: 8,
                    }}
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "key"]}
                      rules={[
                        {
                          required: true,
                          message: "Missing Key",
                        },
                      ]}
                    >
                      <Input placeholder="Key" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "value"]}
                      rules={[
                        {
                          required: true,
                          message: "Missing Value",
                        },
                      ]}
                    >
                      <Input placeholder="Value" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add field
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form.Item>
      </Form>
    </Drawer>
  );
}

export default ProductDrawer;
