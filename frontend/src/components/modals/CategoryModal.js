import { Button, Form, Input, Modal, Upload } from "antd";
import React from "react";
import ImgCrop from "antd-img-crop";
import { useSelector } from "react-redux";

function CategoryModal({
  open,
  form,
  title,
  handleCancel,
  handleOk,
  uploadProps,
}) {
  const { isLoading } = useSelector((state) => state.category);

  return (
    <Modal
      open={open}
      title={title}
      closable={false}
      maskClosable={false}
      destroyOnClose={true}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={isLoading}
          onClick={handleOk}
        >
          Save
        </Button>,
      ]}
    >
      <Form form={form} name="form_in_modal" layout="vertical">
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
            <Upload {...uploadProps}>Select Image</Upload>
          </ImgCrop>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default CategoryModal;
