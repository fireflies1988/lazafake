import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Image,
  Space,
  Table,
  message as antMessage,
  Spin,
  Input,
  Segmented,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductDrawer from "../../components/drawers/ProductDrawer";
import {
  getProductsAsync,
  reset,
  changeSegmented,
} from "../../features/product/productSlice";
import { moneyFormatter, removeAccents, showError } from "../../utils";
import Highlighter from "react-highlight-words";
import { getCategoriesAsync } from "../../features/category/categorySlice";
import moment from "moment";
import ListProductModal from "../../components/modals/ListProductModal";
import ChangePriceModal from "../../components/modals/ChangePriceModal";

function Products() {
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const { products, isError, isSuccess, message, isLoading } = useSelector(
    (state) => state.product
  );
  const [productId, setProductId] = useState();
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.category);

  const [segmented, setSegmented] = useState("Listed");
  const [openList, setOpenList] = useState(false);
  const [openChangePrice, setOpenChangePrice] = useState(false);
  const [productPrice, setProductPrice] = useState();

  useEffect(() => {
    dispatch(getCategoriesAsync());
  }, []);

  // ---- filter orderId
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });
  // ----

  // ---- filter
  const [filteredInfo, setFilteredInfo] = useState({});
  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
  };
  // ----

  const columns = [
    {
      title: "Product ID",
      dataIndex: "productId",
      key: "productId",
      fixed: "left",
      ...getColumnSearchProps("productId"),
    },
    {
      title: "Thumbnail",
      dataIndex: "thumbnail",
      key: "thumbnail",
      fixed: "left",
      render: (_, record) => <Image width={50} src={record.thumbnail} />,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
      ...getColumnSearchProps("brand"),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (_, { price }) => moneyFormatter.format(price),
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: "Sold",
      dataIndex: "sold",
      key: "sold",
      sorter: (a, b) => a.sold - b.sold,
    },
    {
      title: "Most Recent Sale",
      dataIndex: "mostRecentSale",
      key: "mostRecentSale",
      render: (_, { mostRecentSale }) => mostRecentSale?.label,
      sorter: (a, b) => a.mostRecentSale?.value - b.mostRecentSale?.value,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      filterSearch: true,
      filters: categories.map((c) => ({
        text: c.name,
        value: c.name,
      })),
      filterValue: filteredInfo.category || null,
      onFilter: (value, record) => record.category.includes(value),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      render: (_, record) => (
        <Space direction="vertical" style={{ display: "flex" }}>
          {segmented === "Unlisted" && (
            <Button
              type="link"
              size="small"
              onClick={() => {
                setOpenList(true);
                setProductId(record.productId);
              }}
            >
              List
            </Button>
          )}

          {segmented === "Listed" && (
            <Button
              type="link"
              size="small"
              onClick={() => {
                setOpenChangePrice(true);
                setProductId(record.productId);
                setProductPrice(record.price);
              }}
            >
              Change Price
            </Button>
          )}
          <Button
            type="link"
            ghost
            size="small"
            onClick={() => {
              setOpenEdit(true);
              setProductId(record.productId);
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
    dispatch(
      getProductsAsync({ listed: segmented === "Listed" ? true : false })
    );
    dispatch(changeSegmented(segmented));
  }, [segmented]);

  useEffect(() => {
    const tempData = [];
    for (let i = 0; i < products.length; i++) {
      tempData.push({
        key: i,
        productId: products[i]._id,
        name: products[i].name,
        brand: products[i]?.brand,
        price: products[i].price,
        quantity: products[i].quantity,
        sold: products[i].sold,
        mostRecentSale: products[i]?.mostRecentSale,
        category: products[i]?.category?.name,
        thumbnail:
          products[i]?.images?.length > 0 ? products[i]?.images[0]?.url : "",
        createdAt: moment(products[i].createdAt).format("YYYY-MM-DD HH:mm:ss"),
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
      <Space direction="vertical" style={{ display: "flex" }}>
        <Segmented
          options={["Listed", "Unlisted"]}
          value={segmented}
          onChange={(value) => setSegmented(value)}
        />
        <Spin spinning={isLoading}>
          <Table
            columns={columns}
            dataSource={data}
            scroll={{
              x: 1500,
            }}
            onChange={handleChange}
          />
        </Spin>
      </Space>

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
      <ListProductModal
        productId={productId}
        open={openList}
        onCancel={() => setOpenList(false)}
      />
      <ChangePriceModal
        productId={productId}
        price={productPrice}
        open={openChangePrice}
        onCancel={() => setOpenChangePrice(false)}
      />
    </Card>
  );
}

export default Products;
