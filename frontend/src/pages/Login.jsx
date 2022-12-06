import { LockOutlined, UserOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  message as antMessage,
  notification,
} from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import ForgotPasswordModal from "../components/modals/ForgotPasswordModal";
import { loginAsync, reset } from "../features/auth/authSlice";
import "../scss/Login.scss";
import { showError } from "../utils";

function Login() {
  const [open, setOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const dispatch = useDispatch();
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (searchParams.has("error")) {
      notification.error({
        message: "Error",
        description: searchParams.get("message"),
        duration: 5,
      });
    }

    if (searchParams.has("success")) {
      notification.success({
        message: "Notification",
        description: searchParams.get("message"),
        duration: 5,
      });
    }
  }, [searchParams]);

  useEffect(() => {
    if (isError) {
      showError(antMessage, message);
    }

    if (isSuccess) {
      notification.success({
        message: "Notification",
        description: message,
        duration: 5,
      });
    }

    return () => dispatch(reset());
  }, [isError, isSuccess]);

  const onFinish = (values) => {
    console.log("Received values of Login form: ", values);
    dispatch(loginAsync(values));
  };

  return (
    <Card
      style={{ width: "100%", margin: "auto", maxWidth: "400px" }}
      title={<span style={{ fontSize: "20px" }}>Login</span>}
    >
      <Form name="normal_login" className="login-form" onFinish={onFinish}>
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your Email!",
            },
            {
              type: "email",
              message: "The input is not valid E-mail!",
            },
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Email"
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
            <Button
              type="link"
              className="login-form-forgot"
              onClick={() => setOpen(true)}
            >
              Forgot password?
            </Button>
          </div>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            loading={isLoading}
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

      <ForgotPasswordModal open={open} onCancel={() => setOpen(false)} />
    </Card>
  );
}

export default Login;
