import { ShoppingCartOutlined, StarFilled } from "@ant-design/icons";
import {
  Alert,
  Avatar,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Empty,
  Image,
  InputNumber,
  List,
  message as antMessage,
  Rate,
  Row,
  Space,
  Typography,
} from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import ProductList from "../components/ProductList";
import { addToCartAsync } from "../features/cart/cartSlice";
import { getProductsAsync } from "../features/product/productSlice";
import { getReviewsAsync } from "../features/review/reviewSlice";
import { moneyFormatter } from "../utils";
const { Text } = Typography;

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

function ProductDetails() {
  const [visible, setVisible] = useState(false);
  const { productId } = useParams();
  const { products } = useSelector((state) => state.product);
  const { user } = useSelector((state) => state.auth);
  const { isLoading: isLoadingCart } = useSelector((state) => state.cart);
  const [product, setProduct] = useState();
  const [quantity, setQuantity] = useState(1);
  const [sepcificationsData, setSepcificationsData] = useState();
  const dispatch = useDispatch();
  const [activeTabKey, setActiveTabKey] = useState("description");

  const { reviews } = useSelector((state) => state.review);

  useEffect(() => {
    dispatch(getReviewsAsync({ productId }));

    setQuantity(1);
    const product = products.find((p) => p._id.toString() === productId);
    setProduct(product);

    if (product?.specifications) {
      setSepcificationsData(JSON.parse(product?.specifications));
    }
  }, [products, productId]);

  useEffect(() => {
    dispatch(getProductsAsync({ listed: true }));
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
              {product?.averageRating > 0 && (
                <>
                  {Number(product?.averageRating).toFixed(1)}{" "}
                  <StarFilled style={{ color: "gold" }} />
                  <Divider type="vertical" />
                </>
              )}
              {product?.ratingCount} Ratings
              <Divider type="vertical" />
              {product?.sold} Sold
            </Text>
            <Text type="warning" style={{ fontSize: "20px" }}>
              {moneyFormatter.format(product?.price - product?.discount)}
            </Text>
            <Space>
              <Text type="secondary" delete>
                {moneyFormatter.format(product?.price)}
              </Text>
              {product?.discount > 0 && (
                <Text type="danger">
                  -{Math.round((product?.discount / product?.price) * 100)}%
                </Text>
              )}
            </Space>

            {product?.quantity === 0 && (
              <Alert
                message="Sorry, we are out of stock of this item."
                type="error"
              />
            )}

            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <InputNumber
                addonBefore="Quantity"
                min={1}
                max={product?.quantity}
                defaultValue={quantity}
                onChange={(value) => setQuantity(value)}
              />
              <Text type="secondary" style={{ fontSize: "16px" }}>
                {product?.quantity} pieces available
              </Text>
            </div>

            <Space>
              <Button
                type="primary"
                ghost
                size="large"
                icon={<ShoppingCartOutlined />}
                onClick={() => {
                  if (user) {
                    dispatch(
                      addToCartAsync({
                        productId: product._id,
                        quantity: quantity,
                      })
                    );
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
        activeTabKey={activeTabKey}
        onTabChange={(key) => {
          setActiveTabKey(key);
        }}
      >
        {
          {
            description: product?.description ?? <Empty />,
            specifications: (
              <Descriptions bordered column={1}>
                {sepcificationsData &&
                  sepcificationsData.map((spec) => (
                    <Descriptions.Item label={spec.key} key={spec.key}>
                      {spec.value}
                    </Descriptions.Item>
                  ))}
              </Descriptions>
            ),
          }[activeTabKey]
        }
      </Card>

      <Card title="Product Ratings" bordered={false}>
        <Alert
          message={
            <>
              {product?.ratingCount === 0 ? (
                <Text strong style={{ fontSize: "24px" }}>
                  No Reviews Yet
                </Text>
              ) : (
                <Space size="large">
                  <Space direction="vertical" style={{ display: "flex" }}>
                    <Text strong style={{ fontSize: "28px" }}>
                      {Number(product?.averageRating).toFixed(1)}
                      <Text type="secondary" style={{ fontSize: "20px" }}>
                        /5
                      </Text>{" "}
                      <StarFilled style={{ color: "gold" }} />
                    </Text>
                    <Text type="secondary">{product?.ratingCount} Ratings</Text>
                  </Space>

                  <Space
                    direction="vertical"
                    style={{ display: "flex" }}
                    size={2}
                  >
                    <Space>
                      <Rate
                        disabled
                        defaultValue={5}
                        style={{ fontSize: "14px" }}
                      />
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        {reviews.filter((r) => r.rating === 5).length}
                      </Text>
                    </Space>
                    <Space>
                      <Rate
                        disabled
                        defaultValue={4}
                        style={{ fontSize: "14px" }}
                      />
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        {reviews.filter((r) => r.rating === 4).length}
                      </Text>
                    </Space>
                    <Space>
                      <Rate
                        disabled
                        defaultValue={3}
                        style={{ fontSize: "14px" }}
                      />
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        {reviews.filter((r) => r.rating === 3).length}
                      </Text>
                    </Space>
                    <Space>
                      <Rate
                        disabled
                        defaultValue={2}
                        style={{ fontSize: "14px" }}
                      />
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        {reviews.filter((r) => r.rating === 2).length}
                      </Text>
                    </Space>
                    <Space>
                      <Rate
                        disabled
                        defaultValue={1}
                        style={{ fontSize: "14px" }}
                      />
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        {reviews.filter((r) => r.rating === 1).length}
                      </Text>
                    </Space>
                  </Space>
                </Space>
              )}
            </>
          }
          type="warning"
        />

        <List
          itemLayout="horizontal"
          dataSource={reviews}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                style={{ alignItems: "center" }}
                avatar={<Avatar src={item?.user?.avatar?.url} />}
                title={item.user?.fullName}
                description={
                  <Space direction="vertical" style={{ display: "flex" }}>
                    <Rate
                      disabled
                      defaultValue={item.rating}
                      style={{ fontSize: "14px" }}
                    />
                    <Text>{item.comment}</Text>
                    <Text type="secondary">
                      {moment(item.createdAt).startOf("day").fromNow()}
                    </Text>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      <Card
        extra={
          <Link to={`/search?category=${product?.category?.name}`}>More</Link>
        }
        title="Relevant Products"
        bodyStyle={{
          backgroundColor: "#efefef",
          padding: "0.5rem 0",
        }}
        style={{ borderRadius: 0, border: 0 }}
      >
        <ProductList
          columns={6}
          items={products.filter(
            (p) => p?.category?._id.toString() === product?.category?._id
          )}
        />
      </Card>
    </Space>
  );
}

export default ProductDetails;
