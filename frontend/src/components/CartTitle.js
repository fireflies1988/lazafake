import { UserOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import React from "react";

function CartTitle({ title }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <div>{title}</div>
      <Avatar
        size="large"
        style={{
          backgroundColor: "#87d068",
          flexShrink: 0,
          visibility: "hidden",
        }}
        icon={<UserOutlined />}
      />
    </div>
  );
}

export default CartTitle;
