# 238071_NguyenMinhPhu

**Môn học:** Điện toán đám mây  
**Đề tài:** Hệ thống quản lý nhân sự

## 1. Giới thiệu
Xây dựng ứng dụng quản lý nhân sự cho phép xem danh sách nhân viên, tìm kiếm, thêm, cập nhật và xóa thông tin nhân viên. Dữ liệu được lưu trữ trên MongoDB Atlas.

## 2. Công nghệ sử dụng
- Frontend: React, Vite
- Backend: Node.js, Express.js
- Database: MongoDB Atlas
- Container: Docker
- Lưu trữ mã nguồn: GitHub
- Triển khai: Render
- Lưu trữ Docker image: Docker Hub

## 3. Chức năng chính
- Hiển thị danh sách nhân viên.
- Tìm kiếm nhân viên.
- Thêm nhân viên mới.
- Chỉnh sửa thông tin nhân viên.
- Xóa nhân viên.
- Lưu trữ và truy xuất dữ liệu từ MongoDB Atlas.

## 4. Các đường link triển khai

### GitHub
https://github.com/nguyenngochan8373737-ui/238071_NguyenMinhPhu

### Docker Hub
- Backend: https://hub.docker.com/r/nguyenminhphu2809/238071-nguyenminhphu-backend
- Frontend: https://hub.docker.com/r/nguyenminhphu2809/238071-nguyenminhphu-frontend

### Render
- Ứng dụng frontend: https://web-238071.onrender.com
- Backend API: https://api-238071.onrender.com
- API danh sách nhân viên: https://api-238071.onrender.com/api/employees

### MongoDB Atlas
https://cloud.mongodb.com/

Tên database: `238071_NguyenMinhPhu`  
Tên collection: `employees`

## 5. Chạy dự án trên môi trường phát triển

### Backend
1. Mở Terminal và chuyển vào thư mục `backend`.
2. Cài đặt thư viện:

   `npm install`

3. Tạo file `.env` và cấu hình biến môi trường `MONGODB_URI` bằng MongoDB connection string của riêng bạn.
4. Khởi chạy backend:

   `npm start`

### Frontend
1. Mở Terminal khác và chuyển vào thư mục `frontend`.
2. Cài đặt thư viện:

   `npm install`

3. Khởi chạy frontend:

   `npm run dev`

## 6. Kết luận
Dự án áp dụng các công nghệ web và dịch vụ đám mây để xây dựng, lưu trữ và triển khai hệ thống quản lý nhân sự. Frontend, backend và cơ sở dữ liệu được triển khai trên các dịch vụ tương ứng.
