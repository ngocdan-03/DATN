export const PAYMENT_RECEIVER = {
  fullName: "Bùi Ngọc Dân",
  email: "buingocdan2003@gmail.com",
  phone: "0352290195",
  avatar: "https://res.cloudinary.com/diu2nczm5/image/upload/v1775835527/default.jpg",
};

export const PAYMENT_PACKAGES = [
  {
    id: 1,
    label: "Cơ bản",
    amount: 100000,
    description: "Nạp tiền gói 1",
    accentClass: "text-[#5d6678]",
  },
  {
    id: 2,
    label: "Nổi bật",
    amount: 200000,
    description: "Nạp tiền gói 2",
    accentClass: "text-[#005baa]",
  },
  {
    id: 3,
    label: "Cao cấp",
    amount: 500000,
    description: "Nạp tiền gói 3",
    accentClass: "text-[#d97706]",
  },
];

export const PAYMENT_RESULT_STYLES = {
  success: {
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
    card: "border-emerald-200 bg-emerald-50",
    title: "text-emerald-900",
    icon: "✅",
    label: "Thành công",
  },
  warning: {
    badge: "bg-amber-100 text-amber-700 border-amber-200",
    card: "border-amber-200 bg-amber-50",
    title: "text-amber-900",
    icon: "⚠️",
    label: "Cảnh báo",
  },
  error: {
    badge: "bg-red-100 text-red-700 border-red-200",
    card: "border-red-200 bg-red-50",
    title: "text-red-900",
    icon: "❌",
    label: "Thất bại",
  },
};