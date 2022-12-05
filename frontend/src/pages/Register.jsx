import { Button, Card, Form, Input, message as antMessage } from "antd";
import React, { useEffect, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useDispatch, useSelector } from "react-redux";
import { registerAsync, reset } from "../features/auth/authSlice";
import { showError } from "../utils";

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

function Register() {
  const dispatch = useDispatch();
  const recaptchaRef = useRef();
  const [form] = Form.useForm();
  const { isError, message, isSuccess, isLoading } = useSelector(
    (state) => state.auth
  );

  function onChange(value) {
    console.log("Captcha value:", value);
    form.captcha = true;
  }

  useEffect(() => {
    if (isError) {
      showError(antMessage, message);
    }

    if (isSuccess) {
      antMessage.success(
        "A verification code has been sent your email address. Please check your inbox, get the code and enter here to verify your email.",
        5
      );
    }

    return () => dispatch(reset());
  }, [isError, isSuccess]);

  const onFinish = (values) => {
    console.log("Received values of Sign Up form: ", values);
    if (values.captcha === false) {
      antMessage.error("Please complete the reCaptcha!");
    } else {
      dispatch(registerAsync(values));
    }
  };

  return (
    <Card
      style={{ width: "100%", margin: "auto", maxWidth: "600px" }}
      title={<span style={{ fontSize: "20px" }}>Sign Up</span>}
    >
      <Form
        {...formItemLayout}
        name="register"
        form={form}
        initialValues={{
          captcha: false,
        }}
        onFinish={onFinish}
        scrollToFirstError
      >
        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            {
              type: "email",
              message: "The input is not valid E-mail!",
            },
            {
              required: true,
              message: "Please input your E-mail!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
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
          name="confirmPassword"
          label="Confirm Password"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
            },
            {
              min: 6,
              message: "Password must be at least 6 characters long!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
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

        <Form.Item {...tailFormItemLayout} name="captcha">
          <ReCAPTCHA
            ref={recaptchaRef}
            onExpired={() => recaptchaRef.current.reset()}
            sitekey="6LeC5lgjAAAAAAb-VRfMLnYcN7lmC6TUH8fk1cLJ"
            onChange={onChange}
          />
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Sign Up
          </Button>
        </Form.Item>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <span>Already have an account?</span>
          <Button type="link" href="/login">
            Login
          </Button>
        </div>
      </Form>
    </Card>
  );
}

export default Register;
