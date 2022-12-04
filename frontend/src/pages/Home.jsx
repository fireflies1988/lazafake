import {
  Avatar,
  Card,
  Carousel,
  Space,
  Spin,
  message as antMessage,
} from "antd";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductList from "../components/ProductList";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getCategoriesAsync } from "../features/category/categorySlice";
import { getProductsAsync } from "../features/product/productSlice";
import { moneyFormatter, showError } from "../utils";

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
    dispatch(getProductsAsync());
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

      <Card
        title="Featured Products"
        bodyStyle={{
          backgroundColor: "#efefef",
          padding: "0.5rem 0",
        }}
        style={{ borderRadius: 0, border: 0 }}
      >
        <ProductList
          columns={6}
          items={products.slice(0, 12).map((p) => ({
            _id: p._id,
            url: p?.images[0]?.url,
            name: p.name,
            price: moneyFormatter.format(p.price),
            rating: "4.0",
            sold: p.sold,
          }))}
        />
      </Card>

      {categories?.length > 0 &&
        categories.map((c, index) => (
          <Card
            key={index}
            extra={<Link to="#">More</Link>}
            title={c.name}
            bodyStyle={{
              backgroundColor: "#efefef",
              padding: "0.5rem 0",
            }}
            style={{ borderRadius: 0, border: 0 }}
          >
            <ProductList
              columns={6}
              items={products
                .filter((p) => p?.category?._id.toString() === c._id)
                .map((p) => ({
                  _id: p._id,
                  url: p?.images[0]?.url,
                  name: p.name,
                  price: moneyFormatter.format(p.price),
                  rating: "4.0",
                  sold: p.sold,
                }))}
            />
          </Card>
        ))}
    </Space>
  );
}

export default Home;
