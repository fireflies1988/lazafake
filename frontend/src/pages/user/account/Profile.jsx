import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  message as antMessage,
  Select,
  Upload,
} from "antd";
import ImgCrop from "antd-img-crop";
import React, { useState } from "react";
import CardTitle from "../../../components/CartTitle";
import { checkUploadCondition, showError } from "../../../utils";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { useEffect } from "react";
import { reset, updateProfileAsync } from "../../../features/auth/authSlice";

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

function Profile() {
  const [form] = Form.useForm();
  const { user, isError, isSuccess, message, isLoading } = useSelector(
    (state) => state.auth
  );
  let initalFileList = user?.avatar?.url ? [{ url: user?.avatar?.url }] : [];
  console.log("initalFileList", initalFileList);
  const [fileList, setFileList] = useState(initalFileList);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isError) {
      showError(antMessage, message);
    }

    if (isSuccess) {
      antMessage.success(message);
    }

    return () => dispatch(reset());
  }, [isError, isSuccess]);

  useEffect(() => {
    // prevent reupload to cloudinary
    if (user?.avatar?.url) {
      initalFileList = [{ url: user?.avatar?.url }];
      setFileList(initalFileList);
    }
  }, [user]);

  const onFinish = (values) => {
    console.log("Received values of Profile form: ", values);
    console.log(values.dateOfBirth.toISOString());
    console.log("fileList", fileList);

    if (fileList.length > 0 && fileList[0].file) {
      values.avatar = fileList[0].file;
    }
    values.dateOfBirth = values.dateOfBirth.toISOString();
    console.log(values);

    // convert values to formData
    const formData = new FormData();
    for (let key in values) {
      formData.append(key, values[key]);
    }
    dispatch(updateProfileAsync(formData));
  };

  const uploadProps = {
    beforeUpload: (file) => {
      checkUploadCondition(file, antMessage);

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
    name: "avatar",
    showUploadList: {
      showRemoveIcon: false,
    },
  };

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
          email: user?.email,
          fullName: user?.fullName,
          phoneNumber: user?.phoneNumber,
          gender: user?.gender,
          dateOfBirth: dayjs(user?.dateOfBirth),
        }}
      >
        <Form.Item label="Avatar">
          <ImgCrop rotate>
            <Upload {...uploadProps}>
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
          name="fullName"
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

        <Form.Item
          name="phoneNumber"
          label="Phone Number"
          rules={[
            {
              pattern: new RegExp(/^\d{10}$/),
              message: "Invalid phone number!",
            },
          ]}
        >
          <Input
            addonBefore={
              <Form.Item name="prefix" noStyle>
                <Select style={{ width: 70 }}>
                  <Option value="84">+84</Option>
                </Select>
              </Form.Item>
            }
            style={{ width: "100%" }}
          />
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
            loading={isLoading}
          >
            Save
          </Button>
          <Button
            onClick={() => {
              form.resetFields();
              setFileList(initalFileList);
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
