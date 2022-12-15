import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Image,
  Input,
  message as antMessage,
  Space,
  Spin,
  Table,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getReceiptsAsync, reset } from "../../features/receipt/receiptSlice";
import { moneyFormatter, showError } from "../../utils";
import Highlighter from "react-highlight-words";
import moment from "moment";
import AddReceiptModal from "../../components/modals/AddReceiptModal";

function WarehouseReceipts() {
  const { receipts, isSuccess, isError, isLoading, message } = useSelector(
    (state) => state.receipt
  );
  const dispatch = useDispatch();

  const [outerData, setOuterData] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(getReceiptsAsync());
  }, []);

  useEffect(() => {
    const tempOuterData = [];
    for (let i = 0; i < receipts.length; i++) {
      tempOuterData.push({
        key: i.toString(),
        receiptId: receipts[i]._id,
        importedBy: receipts[i]?.user?.email,
        products: receipts[i]?.products,
        createdAt: receipts[i]?.createdAt,
        totalPrice: receipts[i]?.totalPrice,
      });
    }
    setOuterData(tempOuterData);
  }, [receipts]);

  useEffect(() => {
    if (isError) {
      showError(antMessage, message);
    }

    dispatch(reset());
  }, [isError, isSuccess]);

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

  const outerColumns = [
    {
      title: "ID",
      dataIndex: "receiptId",
      key: "receiptId",
      ...getColumnSearchProps("receiptId"),
    },
    {
      title: "Imported By",
      dataIndex: "importedBy",
      key: "importedBy",
      ...getColumnSearchProps("createdBy"),
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (_, { totalPrice }) => moneyFormatter.format(totalPrice),
      sorter: (a, b) => a.totalPrice - b.totalPrice,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
    },
  ];

  const expandedRowRender = (record, index) => {
    const columns = [
      {
        title: "Product ID",
        dataIndex: "productId",
        key: "productId",
      },
      {
        title: "Thumbnail",
        dataIndex: "thumbnail",
        key: "thumbnail",
        render: (_, { thumbnail }) => <Image width={50} src={thumbnail} />,
      },
      {
        title: "Product Name",
        dataIndex: "productName",
        key: "productName",
      },
      {
        title: "Unit Price",
        key: "price",
        dataIndex: "price",
      },
      {
        title: "Quantity",
        dataIndex: "quantity",
        key: "quantity",
      },
      {
        title: "Sold",
        dataIndex: "sold",
        key: "sold",
      },
      {
        title: "Subtotal",
        dataIndex: "subtotal",
        key: "subtotal",
      },
    ];

    const innerData = [];
    const receiptData = outerData.find((o) => o.receiptId === record.receiptId);
    const products = receiptData.products;
    for (let i = 0; i < products.length; i++) {
      innerData.push({
        key: i.toString(),
        productId: products[i]?.product?._id,
        thumbnail:
          products[i]?.product?.images?.length > 0
            ? products[i]?.product?.images[0]?.url
            : "",
        productName: products[i].product?.name,
        price: moneyFormatter.format(products[i].price),
        quantity: products[i]?.quantity,
        sold: products[i]?.sold,
        subtotal: moneyFormatter.format(
          products[i]?.quantity * products[i]?.price
        ),
      });
    }
    return (
      <Table columns={columns} dataSource={innerData} pagination={false} />
    );
  };

  return (
    <Card
      title="Warehouse Receipts"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setOpen(true)}
        >
          New
        </Button>
      }
    >
      <Spin spinning={isLoading}>
        <Table
          columns={outerColumns}
          expandable={{ expandedRowRender }}
          dataSource={outerData}
        />
      </Spin>

      <AddReceiptModal open={open} onCancel={() => setOpen(false)} />
    </Card>
  );
}

export default WarehouseReceipts;
