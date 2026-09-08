import React from "react";
import Header from "../components/Header";

const InfoPage = () => (
  <div style={{ background: "#FCF9F1", minHeight: "100vh" }}>
    <Header />
    <div
      className="container py-5 d-flex flex-column justify-content-center align-items-center"
    >
      <div style={{ maxWidth: 720 }}>
        <h2 className="fw-bold mb-4 text-center" style={{color: "#043A84"}}>Giới thiệu về Dev-Tool-Box</h2>
        <p className="text-center fs-5">
          <b style={{color: "#043A84"}}>DevToolBox</b> tập hợp các tiện ích thường dùng của lập trình viên trong một không gian làm việc nhanh, gọn và dễ tìm kiếm.
        </p>
        <p className="text-center text-muted mb-4">
          Thay vì phải mở nhiều trang web khác nhau, bạn có thể chuyển đổi dữ liệu, tạo mã, kiểm tra định dạng và xử lý các tác vụ kỹ thuật hằng ngày ngay tại một nơi.
        </p>
        <ul>
          <li>Khoảng 30 công cụ về chuyển đổi, mã hóa, mạng, văn bản, dữ liệu và tính toán.</li>
          <li>Tìm kiếm nhanh, lưu công cụ yêu thích và truy cập lịch sử sử dụng gần đây.</li>
          <li>Hỗ trợ tài khoản người dùng, công cụ Premium và khu vực quản trị.</li>
          <li>Giao diện trực quan, phù hợp cho học tập và công việc phát triển phần mềm.</li>
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
