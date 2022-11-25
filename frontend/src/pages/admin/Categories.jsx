import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  Image,
  Input,
  Modal,
  Space,
  Table,
  Upload,
  message,
} from "antd";
import React, { useState } from "react";
import ImgCrop from "antd-img-crop";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Thumbnail",
    dataIndex: "thumbnail",
    key: "thumbnail",
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Space>
        <Button type="primary" ghost size="small">
          Edit
        </Button>
        <Button type="primary" danger size="small">
          Delete
        </Button>
      </Space>
    ),
  },
];

const data = [
  {
    key: "1",
    name: "John Brown",
    thumbnail: (
      <Image
        width={150}
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
      />
    ),
  },
  {
    key: "2",
    name: "John Brown",
    thumbnail: (
      <Image
        width={150}
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
      />
    ),
  },
];

const CategoryAddForm = ({ open, onCreate, onCancel }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  const props = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([
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

  console.log(fileList);

  return (
    <Modal
      open={open}
      title="Add New Category"
      okText="Save"
      cancelText="Cancel"
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      centered
      closable={false}
      maskClosable={false}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate(values);
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <Form
        form={form}
        name="form_in_modal"
        layout="vertical"
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[
            {
              required: true,
              message: "Please input category name!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Thumbnail" required>
          <ImgCrop rotate>
            <Upload {...props}>Select Image</Upload>
          </ImgCrop>
        </Form.Item>
      </Form>
    </Modal>
  );
};

function Categories() {
  const [open, setOpen] = useState(false);

  const onCreate = (values) => {
    console.log("Received values of form: ", values);
    setOpen(false);
  };

  return (
    <Card
      title="Category List"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setOpen(true);
          }}
        >
          Add New Category
        </Button>
      }
    >
      <Table columns={columns} dataSource={data} pagination={false} />
      <CategoryAddForm
        open={open}
        onCreate={onCreate}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </Card>
  );
}

export default Categories;
