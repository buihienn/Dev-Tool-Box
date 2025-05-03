import React from "react";
import { Modal, Button } from "react-bootstrap";

const PopupResult = ({ show, onHide, success, message }) => (
  <Modal show={show} onHide={onHide} centered>
    <Modal.Header closeButton>
      <Modal.Title>{success ? "Thanh toán thành công" : "Thanh toán thất bại"}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p>{message}</p>
    </Modal.Body>
    <Modal.Footer>
      <Button variant={success ? "success" : "danger"} onClick={onHide}>
        Đóng
      </Button>
    </Modal.Footer>
  </Modal>
);

export default PopupResult;