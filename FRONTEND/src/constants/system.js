export const IMAGES = {
    LOGO: "https://res.cloudinary.com/diu2nczm5/image/upload/v1775835528/Logo.png",
    DEFAULT_AVATAR: "https://res.cloudinary.com/diu2nczm5/image/upload/v1775835527/default.jpg",
};

export const ABOUT_MISSION_ITEMS = [
  {
    id: "01",
    title: "Chất lượng Di sản",
    description: "Xây dựng công trình có giá trị vượt thời gian, không bị lỗi thời.",
  },
  {
    id: "02",
    title: "Cộng đồng tinh hoa",
    description: "Kết nối chủ nhân xứng tầm trong hệ sinh thái sống đẳng cấp.",
  },
  {
    id: "03",
    title: "Trách nhiệm xã hội",
    description: "Phát triển đi đôi với bảo tồn môi trường và đóng góp cho đô thị.",
  },
];

export const NAV_ITEMS = [
    { label: "Trang chủ", to: "/" },
    { label: "Giới thiệu", to: "/about" },
    { label: "Trợ lý AI", to: "/chatbot" },
    { label: "Tin tức", to: "/news" },
];

export const FOOTER_LINKS = [
    { label: "Hướng dẫn", to: "/guide" },
    { label: "Điều khoản dịch vụ", to: "/terms-of-service" },
    { label: "Trợ lý AI", to: "/chatbot" },
];

export const CONTACT_INFO = {
  hotline: "0352 290 195",
  email: "buingocdan2003@gmail.com",
  address: "94 Nguyễn Lương Bằng, Liên Chiểu, Đà Nẵng",
  workingHours: "08:30 - 18:00 (Thứ 2 - Thứ 7)",
};

export const USER_SIDEBAR_ITEMS = [
  { label: "Tổng quan", to: "/user/dashboard" },
  { label: "Quản lý tin", to: "/user/posts" },
  { label: "Quản lý tài chính", to: "/user/finance" },
  { label: "Tương tác và cá nhân hóa", to: "/user/engagement" },
  { label: "Thiết lập tài khoản", to: "/user/settings" },
];

export const ADMIN_SIDEBAR_ITEMS = [
  { label: "Tổng quan", to: "/admin/dashboard" },
  { label: "Quản lý bài đăng", to: "/admin/posts" },
  { label: "Quản lý người dùng", to: "/admin/users" },
  { label: "Quản lý tin tức", to: "/admin/news" },
  { label: "Quản lý tài chính", to: "/admin/finance" },
];