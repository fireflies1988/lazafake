import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Drawer,
  Form,
  Input,
  InputNumber,
  message as antMessage,
  Popconfirm,
  Row,
  Select,
  Space,
  Spin,
  Upload,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addProductAsync,
  deleteProductAsync,
  updateProductAsync,
} from "../../features/product/productSlice";
import useFetch from "../../hooks/useFetch";
import { checkUploadCondition, showError } from "../../utils";
const { Option } = Select;

function isImage(url) {
  return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url.toLowerCase());
}

function ProductDrawer({ open, onClose, title, type, productId }) {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [tikiLink, setTikiLink] = useState();
  const [deletedImages, setDeletedImages] = useState([]); // contain imageIds
  const dispatch = useDispatch();
  const { categories, isLoading: loadingCategories } = useSelector(
    (state) => state.category
  );
  const { crawlTikiProductAsync } = useFetch();

  const {
    isSuccess,
    isError,
    isLoading: savingProduct,
    products,
    message,
  } = useSelector((state) => state.product);

  function handleClose() {
    form.resetFields();
    setFileList([]);
    setTikiLink();
    onClose();
  }

  useEffect(() => {
    if (type === "edit") {
      const product = products.find((p) => p._id === productId);
      console.log("product", product);
      if (product) {
        // set initial fields value
        const { specifications, category, mostRecentSale, ...fields } = product;
        form.setFieldsValue(fields);
        form.setFieldValue("mostRecentSale", mostRecentSale?.label);
        form.setFieldValue("category", category?._id);
        if (specifications) {
          form.setFieldValue("specifications", JSON.parse(specifications));
        } else {
          form.setFieldValue("specifications", []);
        }

        const temp = [];
        for (const image of product?.images) {
          temp.push({
            url: image?.url,
            imageId: image._id,
          });
        }
        setFileList(temp);
      }
    }
  }, [productId, open, products]);

  useEffect(() => {
    if (isSuccess) {
      if (type === "add") {
        form.resetFields();
        setFileList([]);
        setTikiLink();
      }

      if (type === "edit") {
      }
    }
  }, [isSuccess, isError]);

  const uploadProps = {
    onRemove: (file) => {
      console.log("Removed file: ", file);
      if (type === "edit") {
        setDeletedImages((deletedImages) => [...deletedImages, file.imageId]);
      }

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

        const formData = new FormData();
        // convert values to formData
        formData.append("name", values.name);
        formData.append("quantity", values.quantity);
        formData.append("description", values.description);
        if (values.category) {
          formData.append("category", values.category);
        }
        if (values.specifications) {
          formData.append(
            "specifications",
            JSON.stringify(values.specifications)
          );
        }

        if (type === "add") {
          for (const file of fileList) {
            formData.append("images", file.file);
          }

          dispatch(addProductAsync(formData));
        }

        if (type === "edit") {
          // add new images
          for (const file of fileList) {
            if (file?.file) {
              formData.append("images", file.file);
            }
          }

          // remove deleted images
          for (const imageId of deletedImages) {
            formData.append("deletedImages", imageId);
          }

          dispatch(updateProductAsync({ productId, formData }));
        }
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  }

  async function copyData() {
    if (!tikiLink?.trim()) {
      return antMessage.error("Please input product link!");
    }

    const response = await crawlTikiProductAsync(tikiLink);

    console.log(response);
    const { brand, specifications, imageUrl, ...rest } = response;

    // set initial fields value
    form.setFieldsValue(rest);
    if (specifications) {
      form.setFieldValue("specifications", JSON.parse(specifications));
    } else {
      form.setFieldValue("specifications", []);
    }

    if (isImage(imageUrl)) {
      // convert imageUrl to file
      const res = await fetch(response.imageUrl);
      const blob = await res.blob();
      const file = new File([blob], "image", {
        type: blob.type,
      });

      setFileList([
        {
          url: imageUrl,
          file: file,
        },
      ]);
    }
  }

  return (
    <Drawer
      destroyOnClose={true}
      title={title}
      width={800}
      onClose={handleClose}
      open={open}
      placement="left"
      bodyStyle={{
        paddingBottom: 80,
      }}
      maskClosable={false}
      closable={false}
      extra={
        <Space>
          <Button onClick={handleClose}>Cancel</Button>
          {type === "edit" && (
            <Popconfirm
              placement="bottom"
              title="Are you sure you want to delete this product?"
              onConfirm={() => {
                dispatch(deleteProductAsync(productId));
                onClose();
              }}
              okText="Yes"
              cancelText="No"
            >
              <Button danger loading={savingProduct}>
                Delete
              </Button>
            </Popconfirm>
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
        {type === "add" && (
          <Form.Item label="Tiki Product Link">
            <Row gutter={8}>
              <Col span={16}>
                <Input
                  value={tikiLink}
                  onChange={(e) => setTikiLink(e.target.value)}
                />
              </Col>
              <Col span={8}>
                <Button onClick={copyData}>Copy Data</Button>
              </Col>
            </Row>
          </Form.Item>
        )}

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

        {type === "edit" && (
          <Form.Item name="price" label="Price">
            <InputNumber addonAfter="VNĐ" disabled defaultValue={0} />
          </Form.Item>
        )}

        {type === "edit" && (
          <Form.Item
            name="discount"
            label="Discount"
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || value <= getFieldValue("price")) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Discount must be less than price!")
                  );
                },
              }),
            ]}
          >
            <InputNumber disabled addonAfter="VNĐ" min={0} defaultValue={0} />
          </Form.Item>
        )}

        {type === "edit" && (
          <Form.Item name="quantity" label="Quantity">
            <InputNumber min={1} disabled defaultValue={0} />
          </Form.Item>
        )}

        {type === "edit" && (
          <>
            <Form.Item name="sold" label="Sold">
              <InputNumber disabled />
            </Form.Item>

            <Form.Item name="mostRecentSale" label="Most Recent Sale">
              <Input disabled />
            </Form.Item>
          </>
        )}

        <Spin spinning={loadingCategories}>
          <Form.Item
            name="category"
            label="Category"
            rules={[
              {
                message: "Please select a category",
                required: true,
              },
            ]}
          >
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
