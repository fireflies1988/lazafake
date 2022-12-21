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
import {
  getBrandsAsync,
  getProductsAsync,
} from "../features/product/productSlice";
import { removeAccents } from "../utils";
const { Text } = Typography;

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // sort by
  const [radioValue, setRadioValue] = useState(searchParams.get("sortBy"));
  const [priceOrder, setPriceOrder] = useState(searchParams.get("order"));
  const [onSale, setOnSale] = useState(
    searchParams.get("onSale") === "true" ? true : false
  );
  const [brandsSelect, setBrandsSelect] = useState([]);
  console.log(onSale);

  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.category);
  const {
    products,
    brands,
    isLoading: loadingProducts,
  } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getCategoriesAsync());
    dispatch(getBrandsAsync());
  }, []);

  useEffect(() => {
    let params = {
      listed: true,
    };
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    console.log(params);

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

  function handleChangeBrands(values) {
    setBrandsSelect(values);
    if (values && values.length > 0) {
      searchParams.set("brands", values);
    } else {
      searchParams.delete("brands");
    }

    setSearchParams(searchParams);
  }

  function onSaleCheck(e) {
    setOnSale(e.target.checked);
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
              removeAccents(option?.label ?? "")
                .toLowerCase()
                .includes(removeAccents(input).toLowerCase())
            }
            options={categories.map((c, index) => ({
              label: c.name,
              value: c.name,
            }))}
          />
          <Divider style={{ margin: "0.5rem 0" }} />
          <Text strong>Brands</Text>
          <Select
            value={brandsSelect}
            mode="multiple"
            loading={loadingProducts}
            allowClear
            style={{
              width: "100%",
            }}
            placeholder="Select brands"
            onChange={handleChangeBrands}
            options={brands.map((brand) => ({
              label: brand,
              value: brand,
            }))}
            filterOption={(input, option) =>
              removeAccents(option?.label ?? "")
                .toLowerCase()
                .includes(removeAccents(input).toLowerCase())
            }
          />

          <Divider style={{ margin: "0.5rem 0" }} />
          <Text strong>Promotion</Text>
          <Checkbox onChange={(e) => onSaleCheck(e)} checked={onSale}>
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
            <ProductList columns={4} items={products} />
          </Spin>
        </Card>
      </Col>
    </Row>
  );
}

export default SearchPage;
