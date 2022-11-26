import {
    Button,
    Card,
    Checkbox,
    Col,
    Divider,
    Form,
    InputNumber,
    Radio,
    Row,
    Select,
    Space,
    Typography
} from "antd";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductList from "../components/ProductList";
const { Text } = Typography;

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [value, setValue] = useState();
  const onChange = (e) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };

  return (
    <Row gutter={16}>
      <Col span={4}>
        <Space
          direction="vertical"
          style={{ display: "flex", backgroundColor: "white", padding: "1rem" }}
        >
          <Text strong>Categories</Text>
          <Select
            defaultValue="lucy"
            style={{ width: "100%" }}
            options={[
              {
                value: "jack",
                label: "Jack",
              },
              {
                value: "lucy",
                label: "Lucy",
              },
              {
                value: "Yiminghe",
                label: "yiminghe",
              },
            ]}
          />
          <Divider style={{ margin: "0.5rem 0" }} />
          <Text strong>Brands</Text>
          <Checkbox defaultChecked={false}>Brand 1</Checkbox>
          <Checkbox defaultChecked={false}>Brand 2</Checkbox>
          <Checkbox defaultChecked={false}>Brand 2</Checkbox>
          <Checkbox defaultChecked={false}>Brand 2</Checkbox>
          <Divider style={{ margin: "0.5rem 0" }} />
          <Text strong>Price Range</Text>
          <Form layout="vertical">
            <Form.Item
              style={{
                marginBottom: 0,
              }}
            >
              <Form.Item
                name="minPrice"
                rules={[
                  {
                    required: true,
                    message: "Please input min price!",
                  },
                ]}
                style={{
                  display: "inline-block",
                  width: "calc(50% - 8px)",
                }}
              >
                <InputNumber placeholder="Min" min={1} />
              </Form.Item>
              <Form.Item
                name="maxPrice"
                dependencies={["minPrice"]}
                style={{
                  display: "inline-block",
                  width: "calc(50% - 8px)",
                  margin: "0 8px",
                }}
                rules={[
                  {
                    required: true,
                    message: "Please input max price!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || value > getFieldValue("minPrice")) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Max price must be greater than min price!")
                      );
                    },
                  }),
                ]}
              >
                <InputNumber placeholder="Max" min={1} />
              </Form.Item>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Apply
              </Button>
            </Form.Item>
          </Form>
        </Space>
      </Col>
      <Col span={20}>
        <Card
          extra={
            <Space size="middle">
              <Text>Sort By</Text>
              <Radio.Group onChange={onChange} value={value}>
                <Radio value={1}>Top Sales</Radio>
                <Radio value={2}>Newest</Radio>
              </Radio.Group>
              <Select
                placeholder="Price"
                style={{ width: 120 }}
                options={[
                  {
                    value: "lowToHigh",
                    label: "Low To High",
                  },
                  {
                    value: "hightToLow",
                    label: "High To Low",
                  },
                ]}
              />
            </Space>
          }
          title="Search result for 'Something'"
          bodyStyle={{
            backgroundColor: "#efefef",
            padding: "0.5rem 0",
          }}
          style={{ borderRadius: 0, border: 0 }}
        >
          <ProductList
            columns={4}
            items={[
              {
                url: "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
                name: "Mainboard Asus Prime B560M-A ( LGA1200 - m-ATX Form Factor - DDR4 )",
                price: "1.000.000đ",
                rating: "4.0",
                sold: 100,
              },
              {
                url: "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
                name: "Mainboard Asus Prime B560M-A ( LGA1200 - m-ATX Form Factor - DDR4 )",
                price: "1.000.000đ",
                rating: "4.0",
                sold: 100,
              },
              {
                url: "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
                name: "Mainboard Asus Prime B560M-A ( LGA1200 - m-ATX Form Factor - DDR4 )",
                price: "1.000.000đ",
                rating: "4.0",
                sold: 100,
              },
              {
                url: "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
                name: "Mainboard Asus Prime B560M-A ( LGA1200 - m-ATX Form Factor - DDR4 )",
                price: "1.000.000đ",
                rating: "4.0",
                sold: 100,
              },
              {
                url: "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
                name: "Mainboard Asus Prime B560M-A ( LGA1200 - m-ATX Form Factor - DDR4 )",
                price: "1.000.000đ",
                rating: "4.0",
                sold: 100,
              },
              {
                url: "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
                name: "Mainboard Asus Prime B560M-A ( LGA1200 - m-ATX Form Factor - DDR4 )",
                price: "1.000.000đ",
                rating: "4.0",
                sold: 100,
              },
              {
                url: "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
                name: "Mainboard Asus Prime B560M-A ( LGA1200 - m-ATX Form Factor - DDR4 )",
                price: "1.000.000đ",
                rating: "4.0",
                sold: 100,
              },
              {
                url: "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
                name: "Mainboard Asus Prime B560M-A ( LGA1200 - m-ATX Form Factor - DDR4 )",
                price: "1.000.000đ",
                rating: "4.0",
                sold: 100,
              },
            ]}
          />
        </Card>
      </Col>
    </Row>
  );
}

export default SearchPage;
