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
  Spin,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import ProductList from "../components/ProductList";
import { getCategoriesAsync } from "../features/category/categorySlice";
import { getProductsAsync } from "../features/product/productSlice";
const { Text } = Typography;

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // sort by
  const [radioValue, setRadioValue] = useState(searchParams.get("sortBy"));
  const [priceOrder, setPriceOrder] = useState(searchParams.get("order"));

  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.category);
  const { products, isLoading: loadingProducts } = useSelector(
    (state) => state.product
  );

  useEffect(() => {
    dispatch(getCategoriesAsync());
  }, []);

  useEffect(() => {
    let params = {
      listed: true,
    };
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    dispatch(getProductsAsync(params));
  }, [searchParams]);

  const onChangeRadio = (e) => {
    setRadioValue(e.target.value);
    setPriceOrder(null);

    searchParams.delete("order");
    searchParams.set("sortBy", e.target.value);
    setSearchParams(searchParams);
  };

  function onChangeSortByPrice(value) {
    setRadioValue(null);
    setPriceOrder(value);

    searchParams.set("sortBy", "price");
    searchParams.set("order", value);
    setSearchParams(searchParams);
  }

  function onFinish(values) {
    if (values.minPrice) {
      searchParams.set("minPrice", values.minPrice);
    } else {
      searchParams.delete("minPrice");
    }

    if (values.maxPrice) {
      searchParams.set("maxPrice", values.maxPrice);
    } else {
      searchParams.delete("maxPrice");
    }

    setSearchParams(searchParams);
  }

  function handleChangeCategory(value) {
    if (value) {
      searchParams.set("category", value);
    } else {
      searchParams.delete("category");
    }
    setSearchParams(searchParams);
  }

  function onSaleCheck(e) {
    searchParams.set("onSale", e.target.checked);
    setSearchParams(searchParams);
  }

  return (
    <Row gutter={16}>
      <Col span={4}>
        <Space
          direction="vertical"
          style={{ display: "flex", backgroundColor: "white", padding: "1rem" }}
        >
          <Text strong>Categories</Text>
          <Select
            placeholder="Select a category"
            defaultValue={
              searchParams.get("category")
                ? {
                    label: searchParams.get("category"),
                    value: searchParams.get("category"),
                  }
                : null
            }
            allowClear
            onChange={handleChangeCategory}
            style={{ width: "100%" }}
            showSearch
            optionFilterProp="label"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={categories.map((c, index) => ({
              label: c.name,
              value: c.name,
            }))}
          />
          <Divider style={{ margin: "0.5rem 0" }} />
          <Text strong>Brands</Text>
          <Checkbox defaultChecked={false}>Brand 1</Checkbox>
          <Checkbox defaultChecked={false}>Brand 2</Checkbox>
          <Checkbox defaultChecked={false}>Brand 2</Checkbox>
          <Checkbox defaultChecked={false}>Brand 2</Checkbox>

          <Divider style={{ margin: "0.5rem 0" }} />
          <Text strong>Promotion</Text>
          <Checkbox defaultChecked={false} onChange={(e) => onSaleCheck(e)}>
            On Sale
          </Checkbox>

          <Divider style={{ margin: "0.5rem 0" }} />
          <Text strong>Price Range</Text>
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              style={{
                marginBottom: 0,
              }}
            >
              <Form.Item
                name="minPrice"
                style={{
                  display: "inline-block",
                  width: "calc(50% - 8px)",
                }}
              >
                <InputNumber
                  placeholder="Min"
                  min={1}
                  defaultValue={searchParams.get("minPrice")}
                />
              </Form.Item>
              <Form.Item
                name="maxPrice"
                dependencies={["minPrice"]}
                style={{
                  display: "inline-block",
                  width: "calc(50% - 8px)",
                  margin: "0 8px",
                }}
              >
                <InputNumber
                  placeholder="Max"
                  min={1}
                  defaultValue={searchParams.get("maxPrice")}
                />
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
              <Radio.Group onChange={onChangeRadio} value={radioValue}>
                <Radio value="sales">Top Sales</Radio>
                <Radio value="newest">Newest</Radio>
              </Radio.Group>
              <Select
                placeholder="Price"
                style={{ width: 180 }}
                value={priceOrder}
                onChange={onChangeSortByPrice}
                options={[
                  {
                    value: "asc",
                    label: "Price: Low To High",
                  },
                  {
                    value: "desc",
                    label: "Price: High To Low",
                  },
                ]}
              />
            </Space>
          }
          title={
            searchParams.get("keyword")
              ? `Search result for "${searchParams.get("keyword")}"`
              : "Products"
          }
          bodyStyle={{
            backgroundColor: "#efefef",
            padding: "0.5rem 0",
          }}
          style={{ borderRadius: 0, border: 0 }}
        >
          <Spin spinning={loadingProducts}>
            <ProductList
              columns={4}
              items={products.map((p) => ({
                _id: p._id,
                url: p?.images[0]?.url,
                name: p.name,
                price: p.price,
                discount: p?.discount,
                averageRating: p?.averageRating,
                ratingCount: p?.ratingCount,
                sold: p.sold,
              }))}
            />
          </Spin>
        </Card>
      </Col>
    </Row>
  );
}

export default SearchPage;
