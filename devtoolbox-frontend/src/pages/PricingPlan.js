import React, { useState } from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import PopupResult from "../components/PopupResult";
import "../styles/Header.css";

const PAYPAL_CLIENT_ID = "AbagdadySoTpDKoqQxVJpDrlKCg3a3GepBDyIquKU7H9kmQL3uH56TY1Gt5mDz2zYISCatMHS8GujCgR"; 

const PricingPlan = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();
  const [popup, setPopup] = useState({ show: false, success: false, message: "" });

  const handleUpgradeSuccess = async () => {
    console.log(`Upgrade ${currentUser.userId}!`);
    // Gọi API backend để cập nhật premium cho user
    const response = await fetch(`http://localhost:8080/api/user/upgrade-premium?userId=${currentUser.userId}`, {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token"),
      }
    });
  
    const result = await response.text();
  
    if (response.ok) {
      setPopup({ show: true, success: true, message: "Bạn đã nâng cấp thành công tài khoản Premium!" });
      setTimeout(() => {
        setPopup({ show: false, success: true, message: "" });
        navigate("/");
        window.location.reload();
      }, 2000);
    } else {
      setPopup({ show: true, success: false, message: "Có lỗi xảy ra: " + result });
    }
  };

  const handleUpgradeFail = () => {
    setPopup({ show: true, success: false, message: "Thanh toán thất bại, vui lòng thử lại." });
  };

  return (
    <div className="container-fluid vh-100" style={{ backgroundColor: "#FCF9F1" }}>
    <Header />
    <div className="container py-5">
      <h2 className="text-center mb-5 fw-bold">Choose plan</h2>
      <Row className="justify-content-center">
        <Col md={5} className="mb-4 h-100">
          <Card className="shadow-sm h-100 d-flex flex-column" style={{ minHeight: 430, borderColor: "#198754", borderWidth: 2 }}>
            <Card.Body className="d-flex flex-column">
              <Card.Title className="text-center fw-bold fs-4">Freemium Plan</Card.Title>
              <div className="text-center mb-3">
                <span style={{ fontSize: 48, fontWeight: 700, color: "#198754" }}>$0</span>
              </div>
              <Card.Text className="flex-grow-1">
                <ul>
                  <li>Sử dụng các công cụ cơ bản miễn phí</li>
                  <li>Lưu các công cụ yêu thích</li>
                </ul>
              </Card.Text>
              <Button
                variant="success"
                className="w-100 mt-auto"
                onClick={() => navigate("/")}
              >
                Get started
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={5} className="mb-4 h-100">
          <Card className="shadow h-100" style={{ minHeight: 430, borderColor: "#0070BA", borderWidth: 2 }}>
            <Card.Body className="d-flex flex-column h-100">
              <Card.Title className="text-center fw-bold fs-4">Premium Plan</Card.Title>
              <div className="text-center mb-3" style={{ color: "#0070BA" }}>
                <span style={{ fontSize: 48, fontWeight: 700 }}>$9.99</span>
              </div>
              <Card.Text>
                <ul>
                  <li>Truy cập tất cả công cụ và tính năng nâng cao</li>
                  <li>Hỗ trợ ưu tiên</li>
                  <li>Cập nhật tính năng mới sớm nhất</li>
                </ul>
              </Card.Text>
              <div className="mt-auto">
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
              </div>
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