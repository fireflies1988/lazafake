import { Card, Col, Row, Statistic } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProductsAsync } from "../../features/product/productSlice";
import { getCategoriesAsync } from "../../features/category/categorySlice";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom",
    },
    title: {
      display: true,
      text: "Product Categories",
    },
  },
};

function ProductStatistics() {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.product);
  const { categories } = useSelector((state) => state.category);

  const [labels, setLabels] = useState([]);
  const [datasets, setDatasets] = useState([]);

  useEffect(() => {
    dispatch(getProductsAsync());
    dispatch(getCategoriesAsync());
  }, []);

  useEffect(() => {
    const tmpLabels = [...categories.map((c) => c.name), "Other"];
    setLabels(tmpLabels);

    const data = [];
    const backgroundColor = [];
    const borderColor = [];
    for (const label of tmpLabels) {
      if (label === "Other") {
        data.push(products.filter((p) => !p.category).length);
      } else {
        data.push(products.filter((p) => p.category.name === label).length);
      }
      let r = Math.floor(Math.random() * 256);
      let g = Math.floor(Math.random() * 256);
      let b = Math.floor(Math.random() * 256);
      backgroundColor.push(`rgba(${r}, ${g}, ${b}, 0.2)`);
      borderColor.push(`rgba(${r}, ${g}, ${b}, 1)`);
    }
    setDatasets([
      {
        label: "# of Products",
        data,
        backgroundColor,
        borderColor,
        borderWidth: 1,
      },
    ]);
  }, [products, categories]);

  return (
    <Card style={{ height: "100%" }}>
      <Row gutter={[16, 32]}>
        <Col span={8}>
          <Row gutter={[16, 32]}>
            <Col span={24}>
              <Statistic title="Total Products" value={products.length} />
            </Col>
            <Col span={24}>
              <Statistic title="Total Categories" value={categories.length} />
            </Col>
            <Col span={24}>
              <Statistic
                valueStyle={{ color: "#cf1322" }}
                title="Low Stock Products (quantity < 10)"
                value={products.filter((p) => p.quantity < 10).length}
              />
            </Col>
          </Row>
        </Col>
        <Col span={16}>
          <Pie
            data={{ labels: labels, datasets: datasets }}
            options={options}
          />
        </Col>
      </Row>
    </Card>
  );
}

export default ProductStatistics;
