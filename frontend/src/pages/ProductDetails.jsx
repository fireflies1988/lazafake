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
  message as antMessage,
} from "antd";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { ShoppingCartOutlined, StarFilled } from "@ant-design/icons";
import { Space, Typography, Empty, Descriptions } from "antd";
import ProductList from "../components/ProductList";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getProductsAsync } from "../features/product/productSlice";
import { addToCartAsync } from "../features/cart/cartSlice";
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
  const { products } = useSelector((state) => state.product);
  const { user } = useSelector((state) => state.auth);
  const { isLoading: isLoadingCart } = useSelector((state) => state.cart);
  const [product, setProduct] = useState();
  const [sepcificationsData, setSepcificationsData] = useState();
  const dispatch = useDispatch();
  const [activeTabKey2, setActiveTabKey2] = useState("description");
  const onTab2Change = (key) => {
    setActiveTabKey2(key);
  };

  useEffect(() => {
    const product = products.find((p) => p._id.toString() === id);
    setProduct(product);

    if (product?.specifications) {
      console.log(JSON.parse(product?.specifications));
      setSepcificationsData(JSON.parse(product?.specifications));
    }
  }, [products, id]);

  useEffect(() => {
    dispatch(getProductsAsync());
  }, []);

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
              src={product?.images[0]?.url}
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
                {product?.images.length > 0 &&
                  product?.images?.map((p) => <Image src={p?.url} />)}
              </Image.PreviewGroup>
            </div>
          </div>
        </Col>

        <Col span={14} style={{ paddingLeft: "1rem" }}>
          <Space direction="vertical" size="middle">
            <Text strong style={{ fontSize: "24px" }}>
              {product?.name}
            </Text>
            <Text style={{ fontSize: "18px" }}>
              4.6 <StarFilled style={{ color: "gold" }} />
              <Divider type="vertical" />
              3.1k Ratings
              <Divider type="vertical" />
              3.1k Sold
            </Text>
            <Text type="warning" style={{ fontSize: "20px" }}>
              {product?.price}đ
            </Text>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <InputNumber addonBefore="Quantity" min={1} defaultValue={1} />
              <div>{product?.quantity} pieces available</div>
            </div>

            <Space>
              <Button
                type="primary"
                ghost
                size="large"
                icon={<ShoppingCartOutlined />}
                onClick={() => {
                  if (user) {
                    dispatch(addToCartAsync(product._id));
                  } else {
                    antMessage.info("You need to login to use this feature!");
                  }
                }}
                loading={isLoadingCart}
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
        {
          {
            description: product?.description ?? <Empty />,
            specifications: (
              <Descriptions bordered column={1}>
                {sepcificationsData?.length > 0 &&
                  sepcificationsData.map((spec) => (
                    <Descriptions.Item label={spec.key} key={spec.key}>
                      {spec.value}
                    </Descriptions.Item>
                  ))}
              </Descriptions>
            ),
          }[activeTabKey2]
        }
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
          items={products.map((p) => ({
            _id: p._id,
            url: p?.images[0]?.url,
            name: p.name,
            price: `${p.price}đ`,
            rating: "4.0",
            sold: 100,
          }))}
        />
      </Card>
    </Space>
  );
}

export default ProductDetails;
