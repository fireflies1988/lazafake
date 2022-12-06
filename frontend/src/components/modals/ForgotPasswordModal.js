import { Form, Input, message as antMessage, Modal, Spin } from "antd";
import React, { useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useDispatch, useSelector } from "react-redux";
import { forgotPasswordAsync } from "../../features/auth/authSlice";

function ForgotPasswordModal({ open, onCancel }) {
  const [form] = Form.useForm();
  const recaptchaRef = useRef();

  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);

  return (
    <Modal
      open={open}
      title="Forgot Password"
      okText="Request Password Reset"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            if (recaptchaRef.current.getValue()) {
              recaptchaRef.current.reset();
              dispatch(forgotPasswordAsync({ email: values.email }));
            } else {
              antMessage.error("Please complete the reCaptcha!");
            }
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <Spin spinning={isLoading}>
        <Form form={form} layout="vertical">
          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              {
                required: true,
                message: "Please input your email address!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="captcha">
            <ReCAPTCHA
              ref={recaptchaRef}
              onExpired={() => recaptchaRef.current.reset()}
              sitekey="6LeC5lgjAAAAAAb-VRfMLnYcN7lmC6TUH8fk1cLJ"
            />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
}

export default ForgotPasswordModal;
