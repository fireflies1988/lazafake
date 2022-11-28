import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Image,
  Space,
  Table,
  message as antMessage,
  Spin,
} from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductDrawer from "../../components/drawers/ProductDrawer";
import { getProductsAsync, reset } from "../../features/product/productSlice";
import { showError } from "../../utils";

function Products() {
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const { products, isError, isSuccess, message, isLoading } = useSelector(
    (state) => state.product
  );
  const [productId, setProductId] = useState();
  const dispatch = useDispatch();
  const columns = [
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
    },
    {
      title: "Thumbnail",
      dataIndex: "thumbnail",
      key: "thumbnail",
      render: (_, record) => <Image width={100} src={record.thumbnail} />,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Imported At",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            ghost
            size="small"
            onClick={() => {
              setOpenEdit(true);
              setProductId(record._id);
            }}
          >
            See Details
          </Button>
        </Space>
      ),
    },
  ];
  const [data, setData] = useState([]);

  useEffect(() => {
    if (isError) {
      showError(antMessage, message);
    }

    if (isSuccess) {
      antMessage.success(message);
    }

    return () => dispatch(reset());
  }, [isError, isSuccess]);

  useEffect(() => {
    dispatch(getProductsAsync());
  }, []);

  useEffect(() => {
    const tempData = [];
    for (let i = 0; i < products.length; i++) {
      tempData.push({
        key: i,
        _id: products[i]._id,
        sku: products[i].sku,
        name: products[i].name,
        price: products[i].price,
        quantity: products[i].quantity,
        category: products[i].category,
        thumbnail:
          products[i]?.images?.length > 0 ? products[i]?.images[0]?.url : "",
        createdAt: products[i].createdAt,
      });
    }
    setData(tempData);
  }, [products]);

  return (
    <Card
      title="Product List"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setOpenAdd(true)}
        >
          Add New Product
        </Button>
      }
    >
      <Spin spinning={isLoading}>
        <Table columns={columns} dataSource={data} />
      </Spin>
      <ProductDrawer
        onClose={() => setOpenAdd(false)}
        open={openAdd}
        type="add"
        title="Add New Product"
      />
      <ProductDrawer
        onClose={() => setOpenEdit(false)}
        open={openEdit}
        type="edit"
        title="Product Details"
        productId={productId}
      />
    </Card>
  );
}

export default Products;
