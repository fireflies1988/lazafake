import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getPromotionsAsync,
  reset,
  changeSegmented,
  deletePromotionAsync,
  terminatePromotionAsync,
} from "../../features/promotion/promotionSlice";
import { moneyFormatter, showError } from "../../utils";
import Highlighter from "react-highlight-words";
import {
  Button,
  Image,
  Input,
  Space,
  Table,
  message as antMessage,
  Card,
  Spin,
  Segmented,
  Popconfirm,
} from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import moment from "moment";
import PromotionModal from "../../components/modals/PromotionModal";

function Promotions() {
  const { promotions, isSuccess, isError, isLoading, message } = useSelector(
    (state) => state.promotion
  );
  const dispatch = useDispatch();
  const [outerData, setOuterData] = useState([]);
  const [open, setOpen] = useState(false);
  const [segmented, setSegmented] = useState("Not Started");
  const [type, setType] = useState("add");
  const [record, setRecord] = useState();

  useEffect(() => {
    dispatch(getPromotionsAsync({ status: segmented }));
    dispatch(changeSegmented(segmented));
  }, [segmented]);

  useEffect(() => {
    const tempOuterData = [];
    for (let i = 0; i < promotions.length; i++) {
      tempOuterData.push({
        key: i.toString(),
        promotionId: promotions[i]._id,
        createdBy: promotions[i]?.user?.email,
        name: promotions[i]?.name,
        note: promotions[i]?.note,
        from: moment(promotions[i]?.from).format("YYYY-MM-DD HH:mm:ss"),
        to: moment(promotions[i]?.to).format("YYYY-MM-DD HH:mm:ss"),
        terminatedAt: promotions[i]?.terminatedAt
          ? moment(promotions[i]?.terminatedAt).format("YYYY-MM-DD HH:mm:ss")
          : "",
        products: promotions[i]?.products,
        createdAt: moment(promotions[i]?.createdAt).format(
          "YYYY-MM-DD HH:mm:ss"
        ),
      });
    }
    setOuterData(tempOuterData);
  }, [promotions]);

  useEffect(() => {
    if (isError) {
      showError(antMessage, message);
    }

    if (isSuccess) {
      antMessage.success(message);
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
      dataIndex: "promotionId",
      key: "promotionId",
      fixed: "left",
      ...getColumnSearchProps("promotionId"),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
    },
    {
      title: "From",
      dataIndex: "from",
      key: "from",
      sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
    },
    {
      title: "To",
      dataIndex: "to",
      key: "to",
      sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
    },
    {
      title: "Terminated At",
      dataIndex: "terminatedAt",
      key: "terminatedAt",
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      key: "createdBy",
      ...getColumnSearchProps("createdBy"),
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
          {segmented === "Not Started" && (
            <>
              <Button
                type="link"
                size="small"
                onClick={() => {
                  setType("edit");
                  setOpen(true);
                  setRecord(record);
                }}
              >
                Edit
              </Button>
              <Popconfirm
                placement="bottomRight"
                title="Are you sure to delete permanently this promotion?"
                onConfirm={() => {
                  dispatch(deletePromotionAsync(record.promotionId));
                }}
                okText="Yes"
                cancelText="No"
              >
                <Button type="link" size="small" danger>
                  Delete
                </Button>
              </Popconfirm>
            </>
          )}
          {segmented === "Happening" && (
            <Popconfirm
              placement="bottomRight"
              title="Are you sure to terminate this promotion?"
              onConfirm={() => {
                dispatch(terminatePromotionAsync(record.promotionId));
              }}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" size="small" danger>
                Terminate
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
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
        title: "Discount",
        key: "discount",
        dataIndex: "discount",
      },
    ];

    const innerData = [];
    const promotionData = outerData.find(
      (o) => o.promotionId === record.promotionId
    );
    const products = promotionData.products;
    for (let i = 0; i < products.length; i++) {
      innerData.push({
        key: i.toString(),
        productId: products[i]?.product?._id,
        thumbnail:
          products[i]?.product?.images?.length > 0
            ? products[i]?.product?.images[0]?.url
            : "",
        productName: products[i].product?.name,
        discount: moneyFormatter.format(products[i].discount),
      });
    }
    return (
      <Table columns={columns} dataSource={innerData} pagination={false} />
    );
  };

  return (
    <Card
      title="Promotions"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setType("add");
            setOpen(true);
          }}
        >
          New Promotion
        </Button>
      }
    >
      <Space direction="vertical" style={{ display: "flex" }}>
        <Segmented
          options={["Not Started", "Happening", "Ended"]}
          value={segmented}
          onChange={(value) => setSegmented(value)}
        />
        <Spin spinning={isLoading}>
          <Table
            columns={outerColumns}
            expandable={{ expandedRowRender }}
            dataSource={outerData}
            scroll={{ x: 1500 }}
          />
        </Spin>
      </Space>

      <PromotionModal
        open={open}
        onCancel={() => setOpen(false)}
        type={type}
        record={record}
      />
    </Card>
  );
}

export default Promotions;
