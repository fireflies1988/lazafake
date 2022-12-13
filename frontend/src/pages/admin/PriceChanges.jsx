import { SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Input,
  Space,
  Spin,
  Table,
  message as antMessage,
  Image,
} from "antd";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { useDispatch, useSelector } from "react-redux";
import { getCategoriesAsync } from "../../features/category/categorySlice";
import { moneyFormatter, showError } from "../../utils";
import {
  getPriceHistoryAsync,
  reset,
} from "../../features/priceHistory/priceHistorySlice";

function PriceChanges() {
  const dispatch = useDispatch();
  const { isLoading, isError, message, priceChanges } = useSelector(
    (state) => state.priceHistory
  );
  const { categories } = useSelector((state) => state.category);

  const [data, setData] = useState([]);

  useEffect(() => {
    dispatch(getCategoriesAsync());
    dispatch(getPriceHistoryAsync());
  }, []);

  useEffect(() => {
    if (isError) {
      showError(antMessage, message);
    }

    return () => dispatch(reset());
  }, [isError]);

  // ---- filter
  const [filteredInfo, setFilteredInfo] = useState({});
  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
  };
  // ----

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

  const columns = [
    {
      title: "ID",
      dataIndex: "priceHistoryId",
      key: "priceHistoryId",
      fixed: "left",
      ...getColumnSearchProps("priceHistoryId"),
    },
    {
      title: "Changed By",
      dataIndex: "changedBy",
      key: "changedBy",
      ...getColumnSearchProps("changedBy"),
    },
    {
      title: "Product ID",
      dataIndex: "productId",
      key: "productId",
      ...getColumnSearchProps("productId"),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Thumbnail",
      dataIndex: "thumbnail",
      key: "thumbnail",
      render: (_, record) => <Image width={50} src={record.thumbnail} />,
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
      title: "Old Price",
      dataIndex: "oldPrice",
      key: "oldPrice",
      render: (_, { oldPrice }) => moneyFormatter.format(oldPrice),
      sorter: (a, b) => a.oldPrice - b.oldPrice,
    },
    {
      title: "New Price",
      dataIndex: "newPrice",
      key: "newPrice",
      render: (_, { newPrice }) => moneyFormatter.format(newPrice),
      sorter: (a, b) => a.newPrice - b.newPrice,
    },
    {
      title: "Changed At",
      dataIndex: "changedAt",
      key: "changedAt",
      sorter: (a, b) => moment(a.changedAt).unix() - moment(b.changedAt).unix(),
    },
  ];

  useEffect(() => {
    const tempData = [];
    for (let i = 0; i < priceChanges.length; i++) {
      tempData.push({
        key: i.toString(),
        priceHistoryId: priceChanges[i]._id,
        changedBy: priceChanges[i]?.user?.email,
        productId: priceChanges[i].product._id,
        name: priceChanges[i]?.product?.name,
        thumbnail:
          priceChanges[i]?.product?.images?.length > 0
            ? priceChanges[i]?.product?.images[0]?.url
            : "",
        category: priceChanges[i].product.category.name,
        oldPrice: priceChanges[i].oldPrice,
        newPrice: priceChanges[i].newPrice,
        changedAt: priceChanges[i].createdAt,
      });
    }
    setData(tempData);
  }, [priceChanges]);

  return (
    <Card title="Price History">
      <Spin spinning={isLoading}>
        <Table
          columns={columns}
          dataSource={data}
          scroll={{
            x: 1500,
          }}
        />
      </Spin>
    </Card>
  );
}

export default PriceChanges;
