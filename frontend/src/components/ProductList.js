import { Badge, Col, Empty, Row } from "antd";
import React from "react";
import { ProductCard } from "./ProductCard";

function ProductList({ items, columns }) {
  const span = 24 / columns;

  return (
    <Row gutter={[16, 16]}>
      {items?.length > 0 ? (
        items.map((item, index) => (
          <Col span={span} key={index}>
            {item.discount > 0 ? (
              <Badge.Ribbon
                text={<>{Math.round((item.discount / item.price) * 100)}% OFF</>}
                color="red"
              >
                <ProductCard item={item} />
              </Badge.Ribbon>
            ) : (
              <ProductCard item={item} />
            )}
          </Col>
        ))
      ) : (
        <Empty />
      )}
    </Row>
  );
}

export default ProductList;
