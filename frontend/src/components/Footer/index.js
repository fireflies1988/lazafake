import React from "react";
import { Button, Col, Row } from "antd";
import Title from "antd/es/typography/Title";
import { StyledFooter } from "./styled";
import visa from "../../assets/visa.png";
import cashOnDelivery from "../../assets/cash-on-delivery.png";
import paypal from "../../assets/paypal.png";
import momo from "../../assets/momo.png";
import bank from "../../assets/bank.png";
import shopeeExpress from "../../assets/shopee-express.png";
import grabExpress from "../../assets/grab-express.png";
import { FaDiscord, FaFacebook, FaInstagram, FaReddit, FaTelegram, FaTiktok, FaTwitter, FaYoutube } from "react-icons/fa";

function Footer() {
  return (
    <StyledFooter>
      <Row
        gutter={16}
        style={{ margin: "2rem", maxWidth: "1600px", width: "100%" }}
      >
        <Col lg={6} sm={12} xs={24}>
          <Title level={4}>Customer Service</Title>
          <Button type="link" className="footer__link">
            Hotline & Online chat (24/7)
          </Button>
          <Button type="link" className="footer__link">
            Help Center
          </Button>
          <Button type="link" className="footer__link">
            How to Buy
          </Button>
          <Button type="link" className="footer__link">
            Shipping & Delivery
          </Button>
          <Button type="link" className="footer__link">
            International Product Policy
          </Button>
          <Button type="link" className="footer__link">
            How to Return
          </Button>
        </Col>
        <Col lg={6} sm={12} xs={24}>
          <Title level={4}>About Us</Title>
          <Button type="link" className="footer__link">
            About LazaFake
          </Button>
          <Button type="link" className="footer__link">
            Affiliate Program
          </Button>
          <Button type="link" className="footer__link">
            Careers
          </Button>
          <Button type="link" className="footer__link">
            Terms & Conditions
          </Button>
          <Button type="link" className="footer__link">
            Privacy Policy
          </Button>
          <Button type="link" className="footer__link">
            Press & Media
          </Button>
          <Button type="link" className="footer__link">
            Operating Regulation
          </Button>
        </Col>
        <Col lg={6} sm={12} xs={24}>
          <Row>
            <Col span={24}>
              <Title level={4}>Payment Methods</Title>
              <img
                src={visa}
                alt="visa"
                style={{ marginRight: "1rem" }}
                width={44}
                height={44}
              />
              <img
                src={paypal}
                alt="paypal"
                style={{ marginRight: "1rem" }}
                width={44}
                height={44}
              />
              <img
                src={momo}
                alt="momo"
                style={{ marginRight: "1rem" }}
                width={44}
                height={44}
              />
              <img
                src={bank}
                alt="bank"
                style={{ marginRight: "1rem" }}
                width={44}
                height={44}
              />
              <img
                src={cashOnDelivery}
                alt="cash-on-delivery"
                width={44}
                height={44}
              />
            </Col>

            <Col span={24}>
              <Title level={4}>Logistics</Title>
              <img
                src={shopeeExpress}
                alt="shopee-express"
                style={{ marginRight: "1rem", width: "128px" }}
              />
              <img
                src={grabExpress}
                alt="grab-express"
                style={{ marginRight: "1rem", width: "128px" }}
              />
            </Col>
          </Row>
        </Col>
        <Col lg={6} sm={12} xs={24}>
          <Title level={4}>Community</Title>
          <FaDiscord size="24px" style={{ marginRight: "1rem" }} />
          <FaTelegram size="24px" style={{ marginRight: "1rem" }}/>
          <FaTiktok size="24px" style={{ marginRight: "1rem" }}/>
          <FaFacebook size="24px" style={{ marginRight: "1rem" }}/>
          <FaTwitter size="24px" style={{ marginRight: "1rem" }}/>
          <FaReddit size="24px" style={{ marginRight: "1rem" }}/>
          <FaInstagram size="24px" style={{ marginRight: "1rem" }}/>
          <FaYoutube size="24px" style={{ marginRight: "1rem" }}/>
        </Col>
      </Row>
    </StyledFooter>
  );
}

export default Footer;
