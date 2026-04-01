# 🏠 RecoLand – Real Estate Platform (Đà Nẵng)

<p align="center">
  <b>Nền tảng giao dịch bất động sản thông minh ứng dụng AI</b><br/>
</p>

[![Java](https://img.shields.io/badge/Java-21-orange?style=flat-square&logo=java)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.4-brightgreen?style=flat-square&logo=springboot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?style=flat-square&logo=mysql)](https://www.mysql.com/)

---

## 📌 Giới Thiệu

**RecoLand** là nền tảng hỗ trợ **mua bán và cho thuê bất động sản tại Đà Nẵng**, được xây dựng với mục tiêu:

- 🔍 Tối ưu tìm kiếm bất động sản  
- 🔐 Đảm bảo bảo mật và an toàn dữ liệu  
- 🤖 Ứng dụng AI để cá nhân hóa trải nghiệm người dùng  

---

## 🌟 Tính Năng Nổi Bật

### 🔐 Bảo Mật & Xác Thực
- JWT + **Refresh Token Rotation**
- Blacklist Access Token khi logout
- Quản lý phiên với **Fixed Window Session**
- RBAC: `USER` / `ADMIN`

---

### 🏗️ Nghiệp Vụ Bất Động Sản
- Quy trình duyệt tin:  
  `PENDING → APPROVED → PUBLISHED → REJECTED`
- Validation nghiệp vụ:
  - ❌ Không cho phép `LAND` có số phòng ngủ
- Quản lý vị trí theo đơn vị hành chính mới

---

### 🤖 AI Gợi Ý Thông Minh
- Thuật toán: **Content-Based Filtering**
- Công nghệ:
  - FastAPI
  - Cosine Similarity
- Gợi ý bất động sản tương tự dựa trên:
  - Giá
  - Diện tích
  - Vị trí
  - Loại hình

---

## 🛠️ Tech Stack

### 🔙 Backend
| Thành phần | Công nghệ |
|----------|---------|
| Core | Java 21, Spring Boot 3.4 |
| Security | Spring Security, JWT |
| Database | MySQL 8, JPA, Hibernate |
| Mapping | MapStruct |
| Validation | Jakarta Validation |

---

### 🎨 Frontend
| Thành phần | Công nghệ |
|----------|---------|
| Framework | React (Vite) |
| UI | Tailwind CSS |
| HTTP | Axios (Interceptor refresh token) |
| Icons | Lucide |

---

### 🤖 AI Service
| Thành phần | Công nghệ |
|----------|---------|
| API | FastAPI |
| ML | Scikit-learn |
| Data | Pandas |

---

## 📁 Cấu Trúc Dự Án

```bash
DATN/
├── BACKEND/        # Spring Boot (Port 8080)
├── FRONTEND/       # ReactJS (Port 5173)
├── AI_SERVICE/     # FastAPI Recommendation
├── References/     # Tài liệu & Database Design
└── README.md
## 🚀 Hướng Dẫn Chạy Dự Án

### 1️⃣ Cấu hình Database

```sql
CREATE DATABASE recoland_db;

### 2️⃣ cập nhật trong file 
```bash
BACKEND/src/main/resources/application.yaml

### 3️⃣ Chạy Backend
```bash
cd BACKEND
./mvnw spring-boot:run

### 4️⃣ Chạy Frontend
```bash
cd FRONTEND
npm install
npm run dev

### 5️⃣ Chạy AI Service
```bash
cd AI_SERVICE
uvicorn main:app --reload

## 🎯 Điểm Nổi Bật Kỹ Thuật

- Stateless Authentication với JWT
- Refresh Token Rotation tăng cường bảo mật
- Blacklist Access Token khi logout
- Clean Architecture: Controller → Service → Repository
- Sử dụng MapStruct tối ưu mapping DTO ↔ Entity
- Axios Interceptor tự động refresh token (Frontend)
- Tách AI Recommendation thành microservice (FastAPI)
- Validation nghiệp vụ bằng Custom Annotation

## 👨‍💻 Tác Giả

- **Bùi Ngọc Dân**
- 🎓 Đại học Bách Khoa – Đại học Đà Nẵng (DUT)
- 💻 Chuyên ngành: Công nghệ thông tin
- 📧 Email: buingocdan2003@gmail.com
- 🔗 GitHub: https://github.com/ngocdan-03