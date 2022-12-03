import { Button, Checkbox, Form, Input, Modal, Radio, Select } from "antd";
import React, { useState } from "react";
import { useSelector } from "react-redux";
const { Option } = Select;
const vietnamProvinces = require("../../data/vietnam");

function AddressModal({ title, open, handleCancel, handleOk, form }) {
  const { isLoading } = useSelector((state) => state.address);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  function handleChangeCity(value) {
    form.setFieldValue("district", null);
    form.setFieldValue("ward", null);
    setDistricts(
      vietnamProvinces
        .find((p) => p.Name === value)
        .Districts.map((d) => ({
          label: d.Name,
          value: d.Name,
        }))
    );
  }

  function handleChangeDistrict(value) {
    form.setFieldValue("ward", null);
    setWards(
      vietnamProvinces
        .find((p) => p.Name === form.getFieldValue("province"))
        .Districts.find((d) => d.Name === value)
        .Wards.map((w) => ({
          label: w.Name,
          value: w.Name,
        }))
    );
  }

  return (
    <Modal
      open={open}
      title={title}
      centered
      destroyOnClose={true}
      closable={false}
      maskClosable={false}
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
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{
          prefix: "84",
          label: "Other",
          isDefault: false,
        }}
      >
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
          hasFeedback
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="phoneNumber"
          label="Phone Number"
          rules={[
            { required: true, message: "Please input your phone number!" },
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
          name="province"
          label="City/Province"
          rules={[
            { required: true, message: "Please select your City/Province!" },
          ]}
        >
          <Select
            placeholder="Select your City/Province"
            onChange={handleChangeCity}
            showSearch
            optionFilterProp="label"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={vietnamProvinces.map((p) => ({
              label: p.Name,
              value: p.Name,
            }))}
          />
        </Form.Item>

        <Form.Item
          name="district"
          label="District"
          rules={[{ required: true, message: "Please select your District!" }]}
        >
          <Select
            placeholder="Select your District"
            options={districts}
            onChange={handleChangeDistrict}
            showSearch
            optionFilterProp="label"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>

        <Form.Item
          name="ward"
          label="Ward"
          rules={[{ required: true, message: "Please select your Ward!" }]}
        >
          <Select
            placeholder="Select your Ward"
            options={wards}
            showSearch
            optionFilterProp="label"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>

        <Form.Item
          name="address"
          label="Street Name, Building, House No."
          rules={[
            {
              required: true,
              message: "Please input your Address!",
              whitespace: true,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Label As"
          name="label"
          className="collection-create-form_last-form-item"
        >
          <Radio.Group>
            <Radio value="Home">Home</Radio>
            <Radio value="Work">Work</Radio>
            <Radio value="Other">Other</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item name="isDefault" valuePropName="checked">
          <Checkbox>Set As Default Address</Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddressModal;
