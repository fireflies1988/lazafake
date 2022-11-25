import React, { useState } from "react";
import {
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  Modal,
  Radio,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
import CardTitle from "../../../components/CartTitle";
import { PlusOutlined } from "@ant-design/icons";

const vietnamProvinces = require("../../../data/vietnam");

const { Option } = Select;
const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Phone Number",
    dataIndex: "phoneNumber",
    key: "phoneNumber",
  },
  {
    title: "Street Name, Building, House No.",
    dataIndex: "address1",
    key: "address1",
  },
  {
    title: "City, District, Ward",
    dataIndex: "address2",
    key: "address2",
  },
  {
    title: "Label",
    key: "label",
    dataIndex: "label",
    render: (_, { isDefault, label }) => (
      <>
        {isDefault && <Tag color="green">Default</Tag>}
        {label === "Home" && <Tag color="red">Home</Tag>}
        {label === "Work" && <Tag color="blue">Work</Tag>}
        {label === "Other" && <Tag color="gold">Other</Tag>}
      </>
    ),
  },
  {
    title: "Action",
    key: "action",
    render: (_, { isDefault }) => (
      <Space direction="vertical" style={{ display: "flex" }}>
        <Space>
          <Button type="primary" ghost size="small">
            Edit
          </Button>
          {!isDefault && (
            <Button type="primary" danger size="small">
              Delete
            </Button>
          )}
        </Space>
        {!isDefault && <Button size="small">Set As Default</Button>}
      </Space>
    ),
  },
];

const data = [
  {
    key: "1",
    name: "John Brown",
    phoneNumber: "0965939861",
    address1: "97 Man Thiện",
    address2: "Phường Hiệp Phú, Thành Phố Thủ Đức, TP. Hồ Chí Minh",
    label: "Home",
    isDefault: true,
  },
  {
    key: "2",
    name: "Jim Green",
    phoneNumber: "0965939861",
    address1: "97 Man Thiện",
    address2: "Phường Hiệp Phú, Thành Phố Thủ Đức, TP. Hồ Chí Minh",
    label: "Work",
    isDefault: false,
  },
  {
    key: "3",
    name: "Joe Black",
    phoneNumber: "0965939861",
    address1: "97 Man Thiện",
    address2: "Phường Hiệp Phú, Thành Phố Thủ Đức, TP. Hồ Chí Minh",
    label: "Other",
    isDefault: false,
  },
];

const AddressCreateForm = ({ open, onCreate, onCancel }) => {
  const [form] = Form.useForm();
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 70 }}>
        <Option value="84">+84</Option>
        <Option value="54">+54</Option>
      </Select>
    </Form.Item>
  );

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
    console.log(
      vietnamProvinces
        .find((p) => p.Name === form.getFieldValue("city"))
        .Districts.find((d) => d.Name === value).Wards
    );
    setWards(
      vietnamProvinces
        .find((p) => p.Name === form.getFieldValue("city"))
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
      title="Add New Address"
      okText="Save"
      cancelText="Cancel"
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      centered
      closable={false}
      maskClosable={false}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate(values);
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{
          modifier: "public",
          prefix: "84",
        }}
      >
        <Form.Item
          name="fullName"
          label="Full Name"
          rules={[
            {
              required: true,
              message: "Please input your Full Name!",
            },
          ]}
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
          <Input addonBefore={prefixSelector} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="city"
          label="City/Province"
          rules={[
            { required: true, message: "Please select your City/Province!" },
          ]}
        >
          <Select
            placeholder="Select your City/Province"
            onChange={handleChangeCity}
          >
            {vietnamProvinces.map((p) => (
              <Option value={p.Name} key={p.Id}>
                {p.Name}
              </Option>
            ))}
          </Select>
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
          />
        </Form.Item>

        <Form.Item
          name="ward"
          label="Ward"
          rules={[{ required: true, message: "Please select your Ward!" }]}
        >
          <Select placeholder="Select your Ward" options={wards} />
        </Form.Item>

        <Form.Item
          name="address"
          label="Street Name, Building, House No."
          rules={[
            {
              required: true,
              message: "Please input your Address!",
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

        <Form.Item name="isDefault">
          <Checkbox>Set As Default Address</Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
};

function AddressBook() {
  const [open, setOpen] = useState(false);

  const onCreate = (values) => {
    console.log("Received values of form: ", values);
    setOpen(false);
  };

  return (
    <Card
      title={<CardTitle title="Address Book" />}
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setOpen(true);
          }}
        >
          Add New Address
        </Button>
      }
    >
      <Table columns={columns} dataSource={data} pagination={false} />
      <AddressCreateForm
        open={open}
        onCreate={onCreate}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </Card>
  );
}

export default AddressBook;
