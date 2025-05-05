import React from "react";
import Header from "../components/Header";

const InfoPage = () => (
  <div style={{ background: "#FCF9F1", minHeight: "100vh" }}>
    <Header />
    <div
      className="container py-5 d-flex flex-column justify-content-center align-items-center"
    >
      <div style={{ maxWidth: 600 }}>
        <h2 className="fw-bold mb-4 text-center" style={{color: "#043A84"}}>Giới thiệu về Dev-Tool-Box</h2>
        <p className="text-center">
          <b style={{color: "#043A84"}}>Dev-Tool-Box</b> là nền tảng web cung cấp bộ công cụ tiện ích cho lập trình viên:
        </p>
        <ul>
          <li>Hơn 20 công cụ chuyển đổi, kiểm tra, sinh mã, phân tích dữ liệu, ...</li>
          <li>Quản lý công cụ yêu thích, công cụ gần đây</li>
          <li>Hỗ trợ tài khoản Premium với nhiều quyền lợi</li>
          <li>Giao diện đơn giản, dễ sử dụng.</li>
          <li>
            Phát triển bởi{" "}
            <a
              href="https://github.com/buihienn"
              target="_blank"
              rel="noopener noreferrer"
            >
              Bùi Hiền
            </a>
            {" "}và{" "} 
            <a
              href="https://github.com/DinhHoHo"
              target="_blank"
              rel="noopener noreferrer"
            >
              Phú Vinh
            </a> 
          </li>
        </ul>
        <p className="">
          Mọi ý kiến đóng góp hoặc báo lỗi xin gửi về{" "}
          <a href="mailto:buihienn@gmail.com">buihienn@gmail.com</a> 
          {" "}hoặc{" "}
          <a href="mailto:hpvinh04@gmail.com">hpvinh04@gmail.com</a>.
        </p>
      </div>
    </div>
  </div>
);

export default InfoPage;