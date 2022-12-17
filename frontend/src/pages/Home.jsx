import {
  Avatar,
  Badge,
  Card,
  Carousel,
  message as antMessage,
  Space,
  Spin,
  Typography,
} from "antd";
import moment from "moment";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import ProductList from "../components/ProductList";
import { getCategoriesAsync } from "../features/category/categorySlice";
import { getProductsAsync } from "../features/product/productSlice";
import { showError } from "../utils";

const { Text } = Typography;

const gridStyle = {
  width: "10%",
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
  alignItems: "center",
  textAlign: "center",
};

function Home() {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const {
    categories,
    isLoading: loadingCategories,
    isError: categoryError,
    message: categoryMessage,
  } = useSelector((state) => state.category);
  const {
    products,
    isError: productError,
    isLoading: loadingProducts,
    message: productMessage,
  } = useSelector((state) => state.product);

  const onChange = (currentSlide) => {
    console.log(currentSlide);
  };

  useEffect(() => {
    dispatch(getCategoriesAsync());
    dispatch(getProductsAsync({ listed: true }));
  }, []);

  useEffect(() => {
    if (categoryError) {
      showError(antMessage, categoryMessage);
    }

    if (productError) {
      showError(antMessage, productMessage);
    }
  }, [categoryError, productError]);

  return (
    <Space
      direction="vertical"
      style={{
        display: "flex",
      }}
      size="large"
    >
      <Carousel afterChange={onChange} autoplay>
        <img
          src="https://images.fpt.shop/unsafe/fit-in/1176x294/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2022/6/14/637907955723186168_F-C1_1200x300.png"
          alt="Linh kiện PC C1"
        />
        <img
          src="https://images.fpt.shop/unsafe/fit-in/1176x294/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2022/11/1/638028588602281408_F-C1_1200x300-1.png"
          alt="LCD hot sale C1"
        />
        <img
          src="https://images.fpt.shop/unsafe/fit-in/1176x294/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2022/6/14/637907955723186168_F-C1_1200x300.png"
          alt="Linh kiện PC C1"
        ></img>
      </Carousel>

      <Spin spinning={loadingCategories}>
        <Card title="Categories" style={{ borderRadius: 0 }}>
          {categories?.length > 0 &&
            categories.map((c, index) => (
              <Card.Grid
                key={index}
                style={gridStyle}
                onClick={() => navigate(`/search?category=${c.name}`)}
              >
                <Avatar src={c?.thumbnail?.url} size={64} />
                <div>{c.name}</div>
              </Card.Grid>
            ))}
        </Card>
      </Spin>

      <Badge.Ribbon color="yellow" placement="start">
        <Card
          title="Best-Selling Products"
          bodyStyle={{
            backgroundColor: "#efefef",
            padding: "0.5rem 0",
          }}
          extra={<Link to={`/search?sortBy=sales`}>More</Link>}
          style={{ borderRadius: 0, border: 0 }}
        >
          <Spin spinning={loadingProducts}>
            <ProductList
              columns={6}
              items={[...products]
                .filter((p) => p.sold > 0)
                .sort((a, b) => b.sold - a.sold)
                .slice(0, 12)}
            />
          </Spin>
        </Card>
      </Badge.Ribbon>

      <Badge.Ribbon text="" color="green" placement="start">
        <Card
          title="New Products"
          bodyStyle={{
            backgroundColor: "#efefef",
            padding: "0.5rem 0",
          }}
          extra={<Link to={`/search?sortBy=newest`}>More</Link>}
          style={{ borderRadius: 0, border: 0 }}
        >
          <Spin spinning={loadingProducts}>
            <ProductList
              columns={6}
              items={[...products]
                .sort(
                  (a, b) =>
                    moment(b.createdAt).unix() - moment(a.createdAt).unix()
                )
                .slice(0, 12)}
            />
          </Spin>
        </Card>
      </Badge.Ribbon>

      <Badge.Ribbon text="" color="red" placement="start">
        <Card
          title="Promotional Products"
          bodyStyle={{
            backgroundColor: "#efefef",
            padding: "0.5rem 0",
          }}
          extra={<Link to={`/search?onSale=true`}>More</Link>}
          style={{ borderRadius: 0, border: 0 }}
        >
          <Spin spinning={loadingProducts}>
            <ProductList
              columns={6}
              items={[...products]
                .map((p) => ({ ...p, sort: Math.random() }))
                .sort((a, b) => a.sort - b.sort)
                .map(({ sort, ...p }) => p)
                .filter((p) => p.discount > 0)
                .slice(0, 12)}
            />
          </Spin>
        </Card>
      </Badge.Ribbon>

      {categories?.length > 0 &&
        categories.map((c, index) => (
          <Card
            key={index}
            extra={<Link to={`/search?category=${c.name}`}>More</Link>}
            title={c.name}
            bodyStyle={{
              backgroundColor: "#efefef",
              padding: "0.5rem 0",
            }}
            style={{ borderRadius: 0, border: 0 }}
          >
            <Spin spinning={loadingProducts}>
              <ProductList
                columns={6}
                items={products.filter(
                  (p) => p?.category?._id.toString() === c._id
                )}
              />
            </Spin>
          </Card>
        ))}
    </Space>
  );
}

export default Home;
