import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Modal,
  Radio,
  Row,
  Select,
} from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { removeAccents } from "../../utils";
import GoogleMap from "../GoogleMap";
const { Option } = Select;
const vietnamProvinces = require("../../data/vietnam");

function AddressModal({ title, open, handleCancel, handleOk, form }) {
  const { isLoading } = useSelector((state) => state.address);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const addressValue = Form.useWatch("address", form);
  const [address, setAddress] = useState({
    city: "",
    district: "",
    ward: "",
  });
  const [mapAddress, setMapAddress] = useState("");

  useEffect(() => {
    setMapAddress(
      `${address.city} ${address.district} ${address.ward} ${addressValue}`.trim()
    );
  }, [address, addressValue]);

  function handleChangeCity(value) {
    setAddress((address) => ({ ...address, city: value }));
    form.setFieldValue("district", null);
    form.setFieldValue("ward", null);
    setDistricts(
      vietnamProvinces
        .find((p) => p.name === value)
        .level2s.map((d) => ({
          label: d.name,
          value: d.name,
        }))
    );
  }

  function handleChangeDistrict(value) {
    setAddress((address) => ({ ...address, district: value }));
    form.setFieldValue("ward", null);
    setWards(
      vietnamProvinces
        .find((p) => p.name === form.getFieldValue("province"))
        .level2s.find((d) => d.name === value)
        .level3s.map((w) => ({
          label: w.name,
          value: w.name,
        }))
    );
  }

  function handleChangeWard(value) {
    setAddress((address) => ({ ...address, ward: value }));
  }

  return (
    <Modal
      open={open}
      title={title}
      centered
      destroyOnClose={true}
      closable={false}
      maskClosable={false}
      width={900}
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
      <Row gutter={[16, 16]}>
        <Col span={12}>
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
                {
                  required: true,
                  message: "Please select your City/Province!",
                },
              ]}
            >
              <Select
                placeholder="Select Your City/Province"
                onChange={handleChangeCity}
                showSearch
                optionFilterProp="label"
                filterOption={(input, option) =>
                  removeAccents(option?.label ?? "")
                    .toLowerCase()
                    .includes(removeAccents(input).toLowerCase())
                }
                options={vietnamProvinces.map((p) => ({
                  label: p.name,
                  value: p.name,
                }))}
              />
            </Form.Item>

            <Form.Item
              name="district"
              label="District"
              rules={[
                { required: true, message: "Please select your District!" },
              ]}
            >
              <Select
                placeholder="Select your District"
                options={districts}
                onChange={handleChangeDistrict}
                showSearch
                optionFilterProp="label"
                filterOption={(input, option) =>
                  removeAccents(option?.label ?? "")
                    .toLowerCase()
                    .includes(removeAccents(input).toLowerCase())
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
                onChange={handleChangeWard}
                optionFilterProp="label"
                filterOption={(input, option) =>
                  removeAccents(option?.label ?? "")
                    .toLowerCase()
                    .includes(removeAccents(input).toLowerCase())
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
        </Col>

        <Col span={12}>
          <GoogleMap
            style={{
              width: "100%",
              height: "500px",
              marginTop: "2rem",
              border: 0,
            }}
            address={mapAddress}
          />
        </Col>
      </Row>
    </Modal>
  );
}

export default AddressModal;
