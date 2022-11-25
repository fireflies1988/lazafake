import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  message,
  Select,
  Upload,
} from "antd";
import ImgCrop from "antd-img-crop";
import React, { useState } from "react";
import CardTitle from "../../../components/CartTitle";
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 6,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 18,
    },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 18,
      offset: 6,
    },
  },
};

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

function Profile() {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 70 }}>
        <Option value="84">+84</Option>
        <Option value="54">+54</Option>
      </Select>
    </Form.Item>
  );

  return (
    <Card
      bodyStyle={{ maxWidth: "768px" }}
      title={<CardTitle title="My Profile" />}
    >
      <Form
        form={form}
        {...formItemLayout}
        name="profile"
        onFinish={onFinish}
        scrollToFirstError
        initialValues={{
          prefix: "84",
        }}
      >
        <Form.Item label="Avatar">
          <ImgCrop rotate>
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              fileList={fileList}
              beforeUpload={beforeUpload}
              onChange={handleChange}
              maxCount={1}
              showUploadList={{
                showRemoveIcon: false,
              }}
            >
              {fileList.length === 0 ? (
                <div>
                  <PlusOutlined />
                  <div
                    style={{
                      marginTop: 8,
                    }}
                  >
                    Upload
                  </div>
                </div>
              ) : (
                <div>Change</div>
              )}
            </Upload>
          </ImgCrop>
        </Form.Item>

        <Form.Item name="email" label="E-mail">
          <Input disabled />
        </Form.Item>

        <Form.Item
          name="fullname"
          label="Full Name"
          rules={[
            {
              required: true,
              message: "Please input your Full Name!",
              whitespace: true,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="phoneNumber" label="Phone Number">
          <Input addonBefore={prefixSelector} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="gender"
          label="Gender"
          rules={[
            {
              required: true,
              message: "Please select gender!",
            },
          ]}
        >
          <Select placeholder="Select your gender">
            <Option value="Male">Male</Option>
            <Option value="Female">Female</Option>
            <Option value="Other">Other</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="dateOfBirth"
          label="Date Of Birth"
          rules={[
            {
              type: "object",
            },
          ]}
        >
          <DatePicker />
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginRight: "8px" }}
          >
            Save
          </Button>
          <Button
            onClick={() => {
              form.resetFields();
            }}
          >
            Reset
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}

export default Profile;
