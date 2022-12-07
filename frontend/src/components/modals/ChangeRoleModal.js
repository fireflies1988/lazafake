import { Form, Modal, Select, Spin } from "antd";
import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeRoleAsync } from "../../features/auth/authSlice";

function ChangeRoleModal({ open, onCancel, role, userId }) {
  const [form] = Form.useForm();
  const { isLoading } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    form.setFieldsValue({ role });
  }, [role, open]);

  return (
    <Modal
      open={open}
      title="Change Role"
      okText="Save"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            dispatch(changeRoleAsync({ userId, role: values.role }));
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <Spin spinning={isLoading}>
        <Form form={form} layout="vertical">
          <Form.Item
            name="role"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              options={[
                {
                  value: "admin",
                  label: "admin",
                },
                {
                  value: "user",
                  label: "user",
                },
              ]}
            />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
}

export default ChangeRoleModal;
