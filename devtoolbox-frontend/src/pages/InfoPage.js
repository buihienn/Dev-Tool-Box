import React from "react";
import Header from "../components/Header";

const InfoPage = () => (
  <div style={{ background: "#FCF9F1", minHeight: "100vh" }}>
    <Header />
    <div
      className="container py-5 d-flex flex-column justify-content-center align-items-center"
    >
      <div style={{ maxWidth: 600 }}>
        <h2 className="fw-bold mb-4 text-center">Giới thiệu về Dev-Tool-Box</h2>
        <p className="text-center">
          <b>Dev-Tool-Box</b> là nền tảng web cung cấp bộ công cụ tiện ích cho lập trình viên và người dùng kỹ thuật:
        </p>
        <ul>
          <li>Hơn 20 công cụ chuyển đổi, kiểm tra, sinh mã, phân tích dữ liệu, ...</li>
          <li>Quản lý công cụ yêu thích, công cụ gần đây</li>
          <li>Hỗ trợ tài khoản Premium với nhiều quyền lợi</li>
          <li>Giao diện hiện đại, dễ sử dụng, hỗ trợ cả desktop và mobile</li>
          <li>
            Phát triển bởi{" "}
            <a
              href="https://github.com/buihienn/Dev-Tool-Box"
              target="_blank"
              rel="noopener noreferrer"
            >
              buihienn
            </a>
          </li>
        </ul>
        <p className="text-center">
          Mọi ý kiến đóng góp hoặc báo lỗi xin gửi về{" "}
          <a href="mailto:buihienn@gmail.com">buihienn@gmail.com</a>.
        </p>
      </div>
    </div>
  </div>
);

export default InfoPage;