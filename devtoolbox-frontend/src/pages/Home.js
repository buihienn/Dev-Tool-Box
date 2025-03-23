import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h1>Trang chủ</h1>
      <p>Chào mừng bạn đến với DevToolBox!</p>
      <Link to="/token-generator">
        <button>🔑 Token Generator</button>
      </Link>
    </div>
  );
};

export default Home;