# 🏠 RecoLand - Sàn Giao Dịch Bất Động Sản Đà Nẵng

[![Java](https://img.shields.io/badge/Java-21-orange?style=flat-square&logo=java)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.4-brightgreen?style=flat-square&logo=springboot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?style=flat-square&logo=mysql)](https://www.mysql.com/)

**RecoLand** là một nền tảng thương mại điện tử chuyên biệt cho thị trường bất động sản tại Đà Nẵng. Dự án được phát triển dưới dạng Đồ án tốt nghiệp (Graduation Thesis), tập trung vào giải quyết bài toán tìm kiếm, đăng tin an toàn và gợi ý bất động sản thông minh.

---

## 🌟 Tính Năng Nổi Bật

### 🔐 Bảo Mật Hệ Thống (Advanced Security)
* **JWT & Refresh Token:** Triển khai cơ chế **Refresh Token Rotation** giúp ngăn chặn việc đánh cắp phiên làm việc.
* **Session Policy:** Quản lý phiên đăng nhập với chính sách **Fixed Window**, đảm bảo hiệu năng và bảo mật.
* **Role-based Access Control (RBAC):** Phân quyền chặt chẽ giữa Người dùng (`USER`) và Quản trị viên (`ADMIN`).

### 🏗️ Nghiệp Vụ Bất Động Sản
* **Custom Validation:** Hệ thống kiểm tra logic dữ liệu nghiêm ngặt (Ví dụ: Chặn đăng tin có số phòng ngủ > 0 đối với loại hình Đất nền `LAND`).
* **Quản lý trạng thái tin:** Luồng duyệt tin chuyên nghiệp từ `PENDING` đến `PUBLISHED`.
* **Vị trí:** là các phường xã sau sát nhập

### 🤖 Trí Tuệ Nhân Tạo (AI Support)
* **Smart Recommendation:** Sử dụng thuật toán **Content-Based Filtering** (FastAPI) để gợi ý các bất động sản tương tự dựa trên hành vi và sở thích của người dùng.

---

## 🛠️ Công Nghệ Sử Dụng

### Backend (Java Ecosystem)
- **Core:** Java 21, Spring Boot 3.4
- **Security:** Spring Security (Stateless), JWT
- **Data:** Spring Data JPA, Hibernate, MySQL 8.0
- **Mapping:** MapStruct (Tối ưu chuyển đổi DTO - Entity)
- **Validation:** Jakarta Bean Validation (Custom Annotations)

### Frontend (Modern Web)
- **Framework:** ReactJS (Vite)
- **Styling:** Tailwind CSS (Responsive Design)
- **Icons:** Lucide Icons
- **HTTP Client:** Axios (Interceptors để xử lý Refresh Token tự động)

### AI Service
- **Framework:** Python, FastAPI
- **Libraries:** Pandas, Scikit-learn (Cosin Similarity)

---

## 📂 Cấu Trúc Thư Mục

```text
DATN/
├── BACKEND/          # Mã nguồn Spring Boot (Port 8080)
├── FRONTEND/         # Mã nguồn ReactJS (Port 5173)
├── References/       # Sơ đồ Database, Tài liệu thiết kế
└── README.md         # Tài liệu hướng dẫn

## 🚀 Hướng Dẫn Chạy Dự Án

Bước 1: Cấu hình Database

Tạo database: CREATE DATABASE recoland_db;

Cập nhật thông tin truy cập (username/password) trong: BACKEND/src/main/resources/application.yaml

Bước 2: Chạy Backend

Bash
cd BACKEND
./mvnw spring-boot:run
Bước 3: Chạy Frontend

Bash
cd FRONTEND
npm install
npm run dev
👤 Thông Tin Tác Giả
Họ và tên: Bùi Ngọc Dân

Trường: Đại học Bách Khoa - Đại học Đà Nẵng (DUT)

Chuyên ngành: Công nghệ thông tin

GitHub: ngocdan-03

Email: buingocdan2003@gmail.com
