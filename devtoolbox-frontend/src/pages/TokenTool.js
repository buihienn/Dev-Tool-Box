import React, { useState } from "react";

const TokenTool = () => {
  const [token, setToken] = useState("");

  const fetchToken = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/token/generate");
      const data = await response.text();
      setToken(data);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(token);
    alert("Token đã được sao chép!");
  };

  return (
    <div>
      <h2>Token Generator</h2>
      <button onClick={fetchToken}>Tạo Token</button>
      {token && (
        <div>
          <p><strong>Token:</strong> {token}</p>
          <button onClick={copyToClipboard}>📋 Sao chép</button>
        </div>
      )}
    </div>
  );
};

export default TokenTool;