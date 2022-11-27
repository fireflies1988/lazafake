import { Avatar, Card, Carousel, Space, Spin } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import ProductList from "../components/ProductList";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getCategoriesAsync } from "../features/category/categorySlice";

const gridStyle = {
  width: "10%",
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
  alignItems: "center",
  textAlign: "center",
};

function Home() {
  const dispatch = useDispatch();
  const { categories, isLoading: categoriesIsLoading } = useSelector(
    (state) => state.category
  );
  const onChange = (currentSlide) => {
    console.log(currentSlide);
  };

  useEffect(() => {
    dispatch(getCategoriesAsync());
  }, []);

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

      <Spin spinning={categoriesIsLoading}>
        <Card title="Categories" style={{ borderRadius: 0 }}>
          {categories?.length > 0 &&
            categories.map((c) => (
              <Card.Grid style={gridStyle}>
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

      <Card
        extra={<Link to="#">More</Link>}
        title="RAM"
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

      <Card
        extra={<Link to="#">More</Link>}
        title="Mouse"
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

export default Home;
