import { LockOutlined, UserOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  message as antMessage,
} from "antd";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../scss/Login.scss";

function Login() {
  const location = useLocation();
  const [initialValues] = useState({
    email: location?.state?.email,
    password: location?.state?.password,
    remember: true,
  });

  useEffect(() => {
    if (location?.state?.message) {
      antMessage.success(location?.state?.message);
      
      // clear location state
      window.history.replaceState({}, document.title)
    }
  }, []);

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  return (
    <Card
      style={{ width: "100%", margin: "auto", maxWidth: "400px" }}
      title={<span style={{ fontSize: "20px" }}>Login</span>}
    >
      <Form
        name="normal_login"
        className="login-form"
        initialValues={initialValues}
        onFinish={onFinish}
      >
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your Email!",
            },
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Username"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your Password!",
            },
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Button type="link" href="" className="login-form-forgot">
              Forgot password?
            </Button>
          </div>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Log in
          </Button>
        </Form.Item>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <span>Don't have an account?</span>
          <Button type="link" href="/register">
            Sign Up
          </Button>
        </div>
      </Form>
    </Card>
  );
}

export default Login;
