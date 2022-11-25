import { StarFilled } from "@ant-design/icons";
import { Card, Col, Empty, Row, Space, Typography } from "antd";
import React from "react";
const { Paragraph, Text } = Typography;

function ProductList({ items }) {
  return (
    <Row gutter={[16, 16]}>
      {items?.length > 0 ? (
        items.map((item) => (
          <Col span={4}>
            <Card
              style={{ height: "320px", borderRadius: 0 }}
              bodyStyle={{ padding: 0 }}
              hoverable
              bordered={false}
            >
              <img
                src={item.url}
                alt="product.img"
                style={{ height: "200px", width: "100%", objectFit: "cover" }}
              />
              <Space
                direction="vertical"
                style={{ display: "flex", gap: "0.25rem", padding: "0.5rem" }}
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
                <Text type="danger">{item.price}</Text>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div>
                    {item.rating} <StarFilled style={{ color: "gold" }} />
                  </div>
                  <div>{item.sold} Sold</div>
                </div>
              </Space>
            </Card>
          </Col>
        ))
      ) : (
        <Empty />
      )}
    </Row>
  );
}

export default ProductList;
