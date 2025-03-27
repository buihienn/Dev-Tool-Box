import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Trang chủ</h1>
      <p>Chào mừng bạn đến với DevToolBox!</p>
      <button onClick={() => navigate("/Token-generator")}>
        🔑 Token Generator
      </button>
      <button onClick={() => navigate("/Hash-text")}>
        🔒 Hash Tool
      </button>
      <button onClick={() => navigate("/login")}>
        Đăng nhập
      </button>
      <button onClick={() => navigate("/register")}>
        Đăng ký
      </button>
    </div>
  );
};

export default Home;