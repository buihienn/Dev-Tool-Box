import React, { useState } from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import PopupResult from "../components/PopupResult";

const PAYPAL_CLIENT_ID = "AbagdadySoTpDKoqQxVJpDrlKCg3a3GepBDyIquKU7H9kmQL3uH56TY1Gt5mDz2zYISCatMHS8GujCgR"; 

const PricingPlan = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();
  const [popup, setPopup] = useState({ show: false, success: false, message: "" });

  const handleUpgradeSuccess = async () => {
    setPopup({ show: true, success: true, message: "Bạn đã nâng cấp thành công tài khoản Premium!" });
    // Gọi API backend để cập nhật premium cho user
    await fetch("/api/user/upgrade-premium?email=" + currentUser.email, { method: "POST" });
    setTimeout(() => {
      setPopup({ show: false, success: true, message: "" });
      navigate("/");
      window.location.reload();
    }, 2000);
  };

  const handleUpgradeFail = () => {
    setPopup({ show: true, success: false, message: "Thanh toán thất bại, vui lòng thử lại." });
  };

  return (
    <div className="container-fluid vh-100" style={{ backgroundColor: "#FCF9F1" }}>
    <Header hideSearch />
    <div className="container py-5">
      <h2 className="text-center mb-5 fw-bold">Choose plan</h2>
      <Row className="justify-content-center">
        <Col md={5} className="mb-4">
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="fw-bold fs-4 mb-3">Freemium Plan</Card.Title>
              <Card.Text>
                <ul>
                  <li>Sử dụng các công cụ cơ bản miễn phí</li>
                  <li>Không cần thẻ tín dụng</li>
                  <li>Truy cập giới hạn một số tính năng nâng cao</li>
                </ul>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={5} className="mb-4">
          <Card className="shadow border-primary">
            <Card.Body>
              <Card.Title className="fw-bold fs-4 mb-3 text-primary">Premium Plan</Card.Title>
              <Card.Text>
                <ul>
                  <li>Truy cập tất cả công cụ và tính năng nâng cao</li>
                  <li>Hỗ trợ ưu tiên</li>
                  <li>Không quảng cáo</li>
                  <li>Cập nhật tính năng mới sớm nhất</li>
                </ul>
              </Card.Text>
              {isAuthenticated ? (
                <PayPalScriptProvider options={{ "client-id": PAYPAL_CLIENT_ID, currency: "USD" }}>
                  <PayPalButtons
                    style={{ layout: "vertical", color: "blue", shape: "rect", label: "pay" }}
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        purchase_units: [
                          {
                            amount: {
                              value: "10.00", // Giá premium, ví dụ 10 USD
                            },
                          },
                        ],
                      });
                    }}
                    onApprove={(data, actions) => {
                      return actions.order.capture().then(handleUpgradeSuccess);
                    }}
                    onCancel={handleUpgradeFail}
                    onError={handleUpgradeFail}
                  />
                </PayPalScriptProvider>
              ) : (
                <Button variant="outline-primary" className="w-100" onClick={() => navigate("/login")}>
                  Sign up now!
                </Button>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <PopupResult
        show={popup.show}
        onHide={() => setPopup({ ...popup, show: false })}
        success={popup.success}
        message={popup.message}
      />
    </div>
    </div>
  );
};

export default PricingPlan;