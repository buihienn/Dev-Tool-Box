import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const VerifyEmail = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const location = useLocation();

  useEffect(() => {
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  if (token) {
    fetch(`http://localhost:8080/api/auth/verify?token=${token}`, {
      method: "GET", // Sử dụng GET thay vì POST
    })
      .then((response) => {
        if (response.ok) {
          return response.json().then((data) => {
            setMessage(data.message || "Email verified successfully!");
            setError(""); // Đảm bảo xóa trạng thái lỗi
          });
        } else {
          return response.json().then((data) => {
            setError(data.message || "Verification failed!");
            setMessage(""); // Đảm bảo xóa trạng thái thành công
          });
        }
      })
      .catch((err) => {
        console.error("Error during verification:", err);
        setError("An error occurred. Please try again later.");
        setMessage(""); // Đảm bảo xóa trạng thái thành công
      });
  } else {
    setError("Invalid token!");
    setMessage(""); // Đảm bảo xóa trạng thái thành công
  }
}, [location]);

  return (
    <div>
      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default VerifyEmail;