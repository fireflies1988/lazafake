import React from "react";
import { Button, Card, Form, Input, message as antMessage } from "antd";
import CardTitle from "../../../components/CartTitle";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { showError } from "../../../utils";
import { reset, changePasswordAsync } from "../../../features/auth/authSlice";

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

function Password() {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const onFinish = (values) => {
    console.log("Received values of Password form: ", values);
    dispatch(changePasswordAsync(values));
  };

  useEffect(() => {
    if (isError) {
      showError(antMessage, message);
    }

    if (isSuccess) {
      antMessage.success(message);
      form.resetFields();
    }

    return () => dispatch(reset());
  }, [isSuccess, isError]);

  return (
    <Card
      bodyStyle={{ maxWidth: "768px" }}
      title={<CardTitle title="Change Password" />}
    >
      <Form
        form={form}
        {...formItemLayout}
        name="password"
        onFinish={onFinish}
        scrollToFirstError
      >
        <Form.Item
          name="currentPassword"
          label="Current Password"
          rules={[
            {
              required: true,
              message: "Please input your Current Password!",
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="newPassword"
          label="New Password"
          rules={[
            {
              required: true,
              message: "Please input your New Password!",
            },
            {
              min: 6,
              message: "Password must be at least 6 characters long!",
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirmNewPassword"
          label="Confirm New Password"
          dependencies={["newPassword"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please confirm your new password!",
            },
            {
              min: 6,
              message: "Password must be at least 6 characters long!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The two passwords that you entered do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Confirm
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}

export default Password;
