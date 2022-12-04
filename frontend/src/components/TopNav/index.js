import {
  AudioOutlined,
  BellOutlined,
  LogoutOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Button,
  Col,
  Dropdown,
  Input,
  List,
  message as antMessage,
  Row,
} from "antd";
import React, { useEffect, useState } from "react";
import { BsInboxes } from "react-icons/bs";
import { GiSoundWaves } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import logo from "../../assets/logo.png";
import { getMyNotificationsAsync, logout } from "../../features/auth/authSlice";
import { getCartItems, reset } from "../../features/cart/cartSlice";
import { showError } from "../../utils";
import Container from "../Container";
import { StyledTopNav } from "./styled";
import { BsBoxSeam } from "react-icons/bs";

const { Search } = Input;

function TopNav() {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const [searchTerm, setSearchTerm] = useState();

  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { cartItems, isSuccess, isError, message } = useSelector(
    (state) => state.cart
  );

  const { notifications } = useSelector((state) => state.auth);

  const onSearch = (value) => {
    console.log(value);
    if (value.trim()) {
      navigate(`/search?keyword=${value}`);
    }
  };
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      // to get number of items
      dispatch(getCartItems());
      dispatch(getMyNotificationsAsync());
    }
  }, [user]);

  useEffect(() => {
    setSearchTerm(transcript);
  }, [transcript]);

  useEffect(() => {
    if (!listening && searchTerm) {
      navigate(`/search?keyword=${searchTerm}`);
    }
  }, [listening]);

  useEffect(() => {
    if (isError) {
      showError(antMessage, message);
    }

    if (isSuccess) {
      antMessage.success(message);
    }

    return () => dispatch(reset());
  }, [isError, isSuccess]);

  const items = [
    {
      key: "1",
      label: (
        <a
          target="_self"
          rel="noopener noreferrer"
          href="/user/account/profile"
        >
          My Account
        </a>
      ),
      icon: <UserOutlined />,
    },
    {
      key: "2",
      label: (
        <a target="_self" rel="noopener noreferrer" href="/user/orders">
          My Orders
        </a>
      ),
      icon: <BsInboxes />,
    },
    {
      type: "divider",
    },
    {
      key: "3",
      label: (
        <a href="/" onClick={() => dispatch(logout())}>
          Logout
        </a>
      ),
      icon: <LogoutOutlined />,
    },
  ];

  function onListening() {
    if (!browserSupportsSpeechRecognition) {
      antMessage.error("Browser doesn't support speech recognition.");
      return;
    }

    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({
        language: "vi-VN",
        // continuous: true,
      });
    }
  }

  return (
    <StyledTopNav>
      <Container>
        <Row gutter={16}>
          <Col span={4} style={{ display: "flex", alignItems: "center" }}>
            <Button
              type="link"
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: 0,
              }}
            >
              <img src={logo} alt="logo" width={44} height={44} />
              <div className="logo">LazaFake</div>
            </Button>
          </Col>

          <Col
            span={20}
            style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}
          >
            <Search
              placeholder="What do you want to buy?"
              onSearch={onSearch}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              enterButton
              suffix={
                <Button type="text" size="small" onClick={onListening}>
                  {listening ? (
                    <GiSoundWaves
                      style={{
                        fontSize: 18,
                        color: "#1890ff",
                        cursor: "pointer",
                      }}
                    />
                  ) : (
                    <AudioOutlined
                      style={{
                        fontSize: 18,
                        color: "#1890ff",
                        cursor: "pointer",
                      }}
                    />
                  )}
                </Button>
              }
              allowClear
              size="large"
              style={{ flex: 1 }}
            />

            <Link to="/cart">
              <Badge count={cartItems?.length} overflowCount={99}>
                <ShoppingCartOutlined
                  style={{ color: "white", fontSize: "30px" }}
                />
              </Badge>
            </Link>

            {user ? (
              <>
                <Dropdown
                  placement="topRight"
                  dropdownRender={() => (
                    <List
                      style={{
                        width: 400,
                        backgroundColor: "white",
                        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                        borderRadius: "0.75rem",
                      }}
                      itemLayout="horizontal"
                      dataSource={notifications.slice(0, 6)}
                      loadMore={
                        <div
                          style={{
                            textAlign: "center",
                            height: 32,
                            lineHeight: "32px",
                          }}
                        >
                          <Button type="link">View All</Button>
                        </div>
                      }
                      renderItem={(item) => (
                        <List.Item style={{ backgroundColor: "#f6ffed" }}>
                          <List.Item.Meta
                            avatar={<Avatar icon={<BsBoxSeam />} />}
                            title="Order Updates"
                            description={item?.message}
                          />
                        </List.Item>
                      )}
                    />
                  )}
                >
                  <Badge
                    count={
                      notifications.filter((n) => n.glanced === false).length
                    }
                    overflowCount={99}
                  >
                    <BellOutlined
                      style={{ color: "white", fontSize: "24px" }}
                    />
                  </Badge>
                </Dropdown>

                <Dropdown
                  menu={{
                    items,
                  }}
                  placement="bottomRight"
                  arrow
                >
                  <Avatar
                    size="large"
                    icon={<UserOutlined />}
                    src={user?.avatar?.url}
                    style={{ cursor: "pointer" }}
                  />
                </Dropdown>
              </>
            ) : (
              <>
                <Button
                  type="link"
                  href="/register"
                  style={{ color: "white", fontWeight: "600", paddingRight: 0 }}
                  size="large"
                >
                  Sign Up
                </Button>

                <Button
                  type="link"
                  href="/login"
                  style={{
                    color: "white",
                    fontWeight: "600",
                    paddingRight: 0,
                    paddingLeft: 0,
                  }}
                  size="large"
                >
                  Login
                </Button>
              </>
            )}
          </Col>
        </Row>
      </Container>
    </StyledTopNav>
  );
}

export default TopNav;
