export default function GuidePaymentSection() {
  const steps = [
    {
      id: "01",
      title: "Vào trang nạp tiền",
      description:
        'Vào trang "Nạp tiền" từ thanh menu hoặc từ khu vực tài khoản người dùng để xem các gói khả dụng.',
      image: "https://res.cloudinary.com/diu2nczm5/image/upload/v1781030190/ntb1.png",
    },
    {
      id: "02",
      title: "Chọn gói phù hợp",
      description:
        "Chọn gói nạp tiền phù hợp với nhu cầu sử dụng của bạn, sau đó nhấn nút 'THANH TOÁN QUA VNPAY' để tiến hành thanh toán.",
      image: "https://res.cloudinary.com/diu2nczm5/image/upload/v1781030191/ntb2.png",
    },
    {
      id: "03",
      title: "Hoàn tất thanh toán",
      description:
        "Sau khi thanh toán xong trên VNPAY, bạn sẽ trở về trang 'kết quả thanh toán'",
      image: "https://res.cloudinary.com/diu2nczm5/image/upload/v1781030191/ntb3.png",
    },
    {
      id: "04",
      title: "kiểm tra số dư",
      description:
        "Kiểm tra lại số dư của bạn xem đã được cập nhật chưa. Nếu có bất kỳ vấn đề nào, hãy liên hệ với bộ phận hỗ trợ khách hàng để được trợ giúp.",
      image: "https://res.cloudinary.com/diu2nczm5/image/upload/v1781030193/ntb4.png",
    },
  ];

  return (
    <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100">
      <div className="mb-10">
        <h2 className="text-2xl font-black text-[#041627] mb-4">
          Hướng dẫn nạp tiền
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed">
          Bạn có thể nạp tiền nhanh chóng để sử dụng các dịch vụ quảng cáo, đẩy tin và nâng cao hiệu quả hiển thị bài đăng.
        </p>
      </div>

      <div className="space-y-12">
        {steps.map((step, index) => (
          <div key={step.id} className="relative flex gap-6">
            <div className="flex-none w-10 h-10 rounded-full bg-[#cca830]/10 text-[#cca830] flex items-center justify-center font-black z-10">
              {step.id}
            </div>

            {index < steps.length - 1 && (
              <div className="absolute left-5 top-10 w-[2px] h-[calc(100%+24px)] bg-gray-100" />
            )}

            <div>
              <h4 className="font-black text-[#041627] mb-2 text-lg">{step.title}</h4>
              <p className="text-sm text-gray-600 mb-4">{step.description}</p>
                <img
                src={step.image}
                alt={step.title}
                className="w-full h-auto rounded-2xl object-contain border border-gray-100 bg-gray-100"
                />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 pt-8 border-t border-gray-100 flex items-center justify-between">
        <p className="text-xs text-gray-400 italic">Cập nhật lần cuối: 14/04/2026</p>
      </div>
    </div>
  );
}