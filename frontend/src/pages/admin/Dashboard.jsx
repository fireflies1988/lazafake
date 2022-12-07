import { Button, Col, Row, Space } from "antd";
import React from "react";
import OrderStatistics from "../../components/statistics/OrderStatistics";
import ProductStatistics from "../../components/statistics/ProductStatistics";
import UserStatistics from "../../components/statistics/UserStatistics";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

function exportPdf() {
  const input = document.getElementById("divToPrint");
  html2canvas(input).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("landscape", "mm", "a4");
    console.log(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    var pdfHeight = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("statistics.pdf");
  });
}

function Dashboard() {
  return (
    <Space direction="vertical" style={{ display: "flex" }} size="middle">
      <Row gutter={[16, 16]} id="divToPrint">
        <Col span={12}>
          <UserStatistics />
        </Col>

        <Col span={12}>
          <ProductStatistics />
        </Col>

        <Col span={24}>
          <OrderStatistics />
        </Col>
      </Row>
      <Button type="primary" onClick={exportPdf}>
        Export Pdf
      </Button>
    </Space>
  );
}

export default Dashboard;
