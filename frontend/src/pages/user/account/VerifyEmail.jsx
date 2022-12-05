import {
  Button,
  Card,
  Space,
  message as antMessage,
  Form,
  Input,
  notification,
  Alert,
  Typography,
} from "antd";
import React, { useRef, useState } from "react";
import CardTitle from "../../../components/CartTitle";
import ReCAPTCHA from "react-google-recaptcha";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  reset,
  sendVerificationCodeAsync,
  verifyEmailAddressAsync,
} from "../../../features/auth/authSlice";
const { Text } = Typography;

function VerifyEmail() {
  const recaptchaRef = useRef();
  const [disabled, setDisabled] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const dispatch = useDispatch();
  const { user, isError, isSuccess, message, isLoading } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (user?.verificationCodeExpiresAt) {
      const expiresAt = new Date(user?.verificationCodeExpiresAt).getTime();
      if (expiresAt > Date.now()) {
        const milis = expiresAt - Date.now();
        setSeconds(Math.floor(milis / 1000));
        setDisabled(true);
        const countdown = setInterval(
          () => setSeconds((seconds) => seconds - 1),
          1000
        );
        const timer = setTimeout(() => {
          clearInterval(countdown);
          setDisabled(false);
          setSeconds(0);
        }, milis);

        return () => {
          clearInterval(countdown);
          clearTimeout(timer);
        };
      }
    }
  }, [user]);

  useEffect(() => {
    if (isError) {
      notification.error({
        message: "Error",
        description: message,
        duration: 5,
      });
    }

    if (isSuccess) {
      notification.success({
        message: "Notification",
        description: message,
        duration: 5,
      });
    }

    dispatch(reset());
  }, [isError, isSuccess]);

  function handleClickGetCode() {
    if (recaptchaRef.current.getValue()) {
      recaptchaRef.current.reset();
      dispatch(sendVerificationCodeAsync());
    } else {
      antMessage.error("Please complete the reCaptcha!");
    }
  }

  function onFinish(values) {
    dispatch(verifyEmailAddressAsync(values));
  }

  return (
    <Card
      bodyStyle={{ maxWidth: "768px" }}
      title={<CardTitle title="Verify Email Address" />}
    >
      {user?.verified ? (
        <Alert
          message="Your email address is already verified."
          type="success"
          showIcon
        />
      ) : (
        <Space direction="vertical" style={{ display: "flex" }} size="large">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey="6LeC5lgjAAAAAAb-VRfMLnYcN7lmC6TUH8fk1cLJ"
            onExpired={() => recaptchaRef.current.reset()}
          />
          <Space>
            <Button
              type="primary"
              ghost
              onClick={handleClickGetCode}
              disabled={disabled}
              loading={isLoading}
            >
              Get Verification Code
            </Button>
            {seconds !== 0 && (
              <Text type="secondary">Resend after {seconds}s</Text>
            )}
          </Space>

          <Form
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 20 }}
            onFinish={onFinish}
          >
            <Form.Item
              label="Verification Code"
              name="code"
              labelAlign="left"
              rules={[
                {
                  required: true,
                  message: "Please input the verification code!",
                },
              ]}
            >
              <Input placeholder="Enter code here" />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 5, span: 20 }}>
              <Button type="primary" htmlType="submit" loading={isLoading}>
                Verify
              </Button>
            </Form.Item>
          </Form>
        </Space>
      )}
    </Card>
  );
}

export default VerifyEmail;
