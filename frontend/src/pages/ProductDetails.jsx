import {
  Alert,
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Image,
  InputNumber,
  List,
  Rate,
  Row,
} from "antd";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { ShoppingCartOutlined, StarFilled } from "@ant-design/icons";
import { Space, Typography, Empty, Descriptions } from "antd";
import ProductList from "../components/ProductList";
const { Text, Link } = Typography;

const tabListNoTitle = [
  {
    key: "description",
    tab: "Description",
  },
  {
    key: "specifications",
    tab: "Specifications",
  },
];
const contentListNoTitle = {
  description: <Empty />,
  specifications: (
    <Descriptions bordered column={1}>
      <Descriptions.Item label="Product">Cloud Database</Descriptions.Item>
      <Descriptions.Item label="Billing Mode">Prepaid</Descriptions.Item>
      <Descriptions.Item label="Billing Mode">Prepaid</Descriptions.Item>
      <Descriptions.Item label="Billing Mode">Prepaid</Descriptions.Item>
      <Descriptions.Item label="Billing Mode">Prepaid</Descriptions.Item>
      <Descriptions.Item label="Billing Mode">Prepaid</Descriptions.Item>
      <Descriptions.Item label="Billing Mode">Prepaid</Descriptions.Item>
    </Descriptions>
  ),
};

const data = [
  {
    title: "Ant Design Title 1",
  },
  {
    title: "Ant Design Title 2",
  },
  {
    title: "Ant Design Title 3",
  },
  {
    title: "Ant Design Title 4",
  },
];

function ProductDetails() {
  const [visible, setVisible] = useState(false);
  const { id } = useParams();
  const [activeTabKey2, setActiveTabKey2] = useState("app");
  const onTab2Change = (key) => {
    setActiveTabKey2(key);
  };

  return (
    <Space direction="vertical" size="large" style={{ display: "flex" }}>
      <Row
        gutter={16}
        style={{
          backgroundColor: "white",
          padding: "1rem",
          marginLeft: 0,
          marginRight: 0,
        }}
      >
        <Col span={10}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              boxShadow:
                "rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px",
            }}
          >
            <Image
              preview={{
                visible: false,
              }}
              style={{ maxHeight: "550px" }}
              src="https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp"
              onClick={() => setVisible(true)}
            />
            <div
              style={{
                display: "none",
              }}
            >
              <Image.PreviewGroup
                preview={{
                  visible,
                  onVisibleChange: (vis) => setVisible(vis),
                }}
              >
                <Image src="https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp" />
                <Image src="https://gw.alipayobjects.com/zos/antfincdn/cV16ZqzMjW/photo-1473091540282-9b846e7965e3.webp" />
                <Image src="https://gw.alipayobjects.com/zos/antfincdn/x43I27A55%26/photo-1438109491414-7198515b166b.webp" />
              </Image.PreviewGroup>
            </div>
          </div>
        </Col>

        <Col span={14} style={{ paddingLeft: "1rem" }}>
          <Space direction="vertical" size="middle">
            <Text strong style={{ fontSize: "24px" }}>
              Chuột Máy Tính Razer Naga Trinity - Multicolor Wired Mmo Gaming
            </Text>
            <Text style={{ fontSize: "18px" }}>
              4.6 <StarFilled style={{ color: "gold" }} />
              <Divider type="vertical" />
              3.1k Ratings
              <Divider type="vertical" />
              3.1k Sold
            </Text>
            <Text type="warning" style={{ fontSize: "20px" }}>
              1.000.000đ
            </Text>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <InputNumber addonBefore="Quantity" min={1} defaultValue={1} />
              <div>38346 pieces available</div>
            </div>

            <Space>
              <Button
                type="primary"
                ghost
                size="large"
                icon={<ShoppingCartOutlined />}
              >
                Add to Cart
              </Button>
              <Button type="primary" size="large">
                Buy Now
              </Button>
            </Space>
          </Space>
        </Col>
      </Row>

      <Card
        tabList={tabListNoTitle}
        activeTabKey={activeTabKey2}
        onTabChange={(key) => {
          onTab2Change(key);
        }}
      >
        {contentListNoTitle[activeTabKey2]}
      </Card>

      <Card title="Product Ratings" bordered={false}>
        <Alert
          message={
            <Text strong style={{ fontSize: "24px" }}>
              4.6 <StarFilled style={{ color: "gold" }} /> (21 Ratings)
            </Text>
          }
          type="warning"
        />

        <List
          itemLayout="horizontal"
          dataSource={data}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                style={{ alignItems: "center" }}
                avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                title={item.title}
                description={
                  <Space direction="vertical" style={{ display: "flex" }}>
                    <Rate
                      disabled
                      defaultValue={2}
                      style={{ fontSize: "14px" }}
                    />
                    <Text>Very good</Text>
                    <Text type="secondary">4 weeks ago</Text>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      <Card
        extra={<Link to="#">More</Link>}
        title="Related Products"
        bodyStyle={{
          backgroundColor: "#efefef",
          padding: "0.5rem 0",
        }}
        style={{ borderRadius: 0, border: 0 }}
      >
        <ProductList
          columns={6}
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
          ]}
        />
      </Card>
    </Space>
  );
}

export default ProductDetails;
