import { StarFilled } from "@ant-design/icons";
import { Card, Space, Typography } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { moneyFormatter } from "../utils";
const { Paragraph, Text } = Typography;

export function ProductCard({ item }) {
  const navigate = useNavigate();

  return (
    <Card
      style={{
        height: "320px",
        borderRadius: 0,
      }}
      bodyStyle={{
        padding: 0,
      }}
      hoverable
      bordered={false}
      onClick={() => navigate(`/products/${item._id}`)}
    >
      <img
        src={item?.images?.length > 0 ? item?.images[0]?.url : ""}
        alt="product.img"
        style={{
          height: "200px",
          width: "100%",
          objectFit: "cover",
        }}
      />
      <Space
        direction="vertical"
        style={{
          display: "flex",
          padding: "0.5rem",
        }}
      >
        <Paragraph
          strong
          ellipsis={{
            rows: 2,
          }}
          style={{
            marginBottom: 0,
          }}
        >
          {item.name}
        </Paragraph>

        <Space>
          <Text type="danger">
            {moneyFormatter.format(item.price - item.discount)}
          </Text>
          {item.discount > 0 && (
            <Text
              type="secondary"
              delete
              style={{
                fontSize: "12px",
              }}
            >
              {moneyFormatter.format(item.price)}
            </Text>
          )}
        </Space>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div>
            {item?.averageRating !== 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <Text type="secondary">{item?.averageRating.toFixed(1)}</Text>
                <StarFilled
                  style={{
                    color: "gold",
                  }}
                />
                <Text
                  type="secondary"
                  style={{
                    fontSize: "12px",
                  }}
                >
                  ({item?.ratingCount})
                </Text>
              </div>
            )}
          </div>
          <Text type="secondary">{item.sold} Sold</Text>
        </div>
      </Space>
    </Card>
  );
}
