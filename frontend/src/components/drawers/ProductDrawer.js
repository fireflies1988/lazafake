import {
  MinusCircleOutlined,
  PlusOutlined,
  SkinOutlined,
} from "@ant-design/icons";
import {
  Button,
  Drawer,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Upload,
  message as antMessage,
  Spin,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCategoriesAsync } from "../../features/category/categorySlice";
import {
  addProductAsync,
  deleteProductAsync,
} from "../../features/product/productSlice";
import { checkUploadCondition } from "../../utils";
const { Option } = Select;

function ProductDrawer({ open, onClose, title, type, productId }) {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const dispatch = useDispatch();
  const { categories, isLoading: loadingCategories } = useSelector(
    (state) => state.category
  );

  const {
    isSuccess,
    isLoading: savingProduct,
    products,
  } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getCategoriesAsync());
  }, []);

  useEffect(() => {
    if (type === "edit") {
      const product = products.find((p) => p._id.toString() === productId);
      console.log(product);
      if (product) {
        const { specifications, ...fields } = product;
        form.setFieldsValue(fields);
        if (specifications) {
          form.setFieldValue("specifications", JSON.parse(specifications));
        }

        const temp = [];
        for (const image of product?.images) {
          temp.push({
            url: image?.url,
          });
        }
        setFileList(temp);
      }
    }
  }, [productId, open]);

  useEffect(() => {
    if (isSuccess) {
      form.resetFields();
      setFileList([]);
    }
  }, [isSuccess]);

  const uploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      checkUploadCondition(file, antMessage);

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

  function onSave() {
    form
      .validateFields()
      .then((values) => {
        console.log("Product drawer: ", values);
        console.log("fileList: ", fileList);

        if (type === "add") {
          const formData = new FormData();
          if (fileList.length > 0 && fileList[0].file) {
            for (const file of fileList) {
              formData.append("images", file.file);
            }
          }

          // convert values to formData
          formData.append("sku", values.sku);
          formData.append("name", values.name);
          formData.append("price", values.price);
          formData.append("quantity", values.quantity);
          formData.append("description", values.description);
          formData.append("category", values.category);
          if (values.specifications) {
            formData.append(
              "specifications",
              JSON.stringify(values.specifications)
            );
          }

          dispatch(addProductAsync(formData));
        }

        if (type === "edit") {
        }
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  }

  return (
    <Drawer
      destroyOnClose={true}
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
          {type === "edit" && (
            <Button
              danger
              onClick={() => {
                dispatch(deleteProductAsync(productId));
                onClose();
              }}
              loading={savingProduct}
            >
              Delete
            </Button>
          )}
          <Button onClick={onSave} type="primary" loading={savingProduct}>
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
              whitespace: true,
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
              whitespace: true,
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

        <Spin spinning={loadingCategories}>
          <Form.Item name="category" label="Category">
            <Select placeholder="Please select a category" allowClear>
              {categories.length > 0 &&
                categories.map((c) => (
                  <Option key={c._id} value={c._id}>
                    {c.name}
                  </Option>
                ))}
            </Select>
          </Form.Item>
        </Spin>

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

        <Form.Item label="Images">
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
