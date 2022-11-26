import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Image, Space, Table } from "antd";
import React, { useState } from "react";
import ProductDrawer from "../../components/drawers/ProductDrawer";

function Products() {
  const [openAdd, setOpenAdd] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);

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
      dataIndex: "importedAt",
      key: "importedAt",
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
            onClick={() => setOpenUpdate(true)}
          >
            See Details
          </Button>
        </Space>
      ),
    },
  ];

  const data = [
    {
      key: "1",
      sku: "3412sadf",
      name: "John Brown",
      price: "32142314",
      quantity: 10,
      category: "Mouse",
      thumbnail: (
        <Image
          width={100}
          src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        />
      ),
      importedAt: "15/25/2022",
    },
    {
      key: "1",
      sku: "3412sadf",
      name: "John Brown",
      price: "32142314",
      quantity: 10,
      category: "Mouse",
      thumbnail: (
        <Image
          width={100}
          src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        />
      ),
      importedAt: "15/25/2022",
    },
    {
      key: "1",
      sku: "3412sadf",
      name: "John Brown",
      price: "32142314",
      quantity: 10,
      category: "Mouse",
      thumbnail: (
        <Image
          width={100}
          src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        />
      ),
      importedAt: "15/25/2022",
    },
    {
      key: "1",
      sku: "3412sadf",
      name: "John Brown",
      price: "32142314",
      quantity: 10,
      category: "Mouse",
      thumbnail: (
        <Image
          width={100}
          src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        />
      ),
      importedAt: "15/25/2022",
    },
  ];

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
      <Table columns={columns} dataSource={data} />
      <ProductDrawer
        onClose={() => setOpenAdd(false)}
        open={openAdd}
        type="add"
        title="Add New Product"
      />
      <ProductDrawer
        onClose={() => setOpenUpdate(false)}
        open={openUpdate}
        type="update"
        title="Product Details"
      />
    </Card>
  );
}

export default Products;
