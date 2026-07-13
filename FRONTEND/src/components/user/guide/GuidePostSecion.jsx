export default function GuidePostSection() {
  const steps = [
    {
      id: "01",
      title: "Vào trang đăng tin",
      description:
        'Chọn mục "Đăng tin" trên thanh điều hướng để vào trang đăng tin',
      image: "https://res.cloudinary.com/diu2nczm5/image/upload/v1781030002/dtb1.png",
    },
    {
      id: "02",
      title: "Điền chính xác thông tin bất động sản",
      description:
        "Chọn Phường/Xã tại Đà Nẵng, nhập tên đường,pháp lý,...  và tải lên ít nhất 4 ảnh rõ nét. Xong rồi thì nhấn đăng tin thôi!",
      image: "https://res.cloudinary.com/diu2nczm5/image/upload/v1781030003/dtb2.png",
    },
    {
      id: "03",
      title: "Hướng dẫn lấy vị trí bất động sản trên bản đồ",
      description:
        "Ở phần vị trí trên bản đồ, bạn nhấn vào thanh bên dưới để mở bản đồ. Sau đó, bạn nhập địa chỉ bất động sản vào thanh tìm kiếm trên bản đồ, chọn đúng vị trí và nhấn xác nhận để hoàn tất việc lấy tọa độ.",
      image: "https://res.cloudinary.com/diu2nczm5/image/upload/v1781365911/dtb3.png",
    },
  ];

  return (
    <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100">
      <div className="mb-10">
        <h2 className="text-2xl font-black text-[#041627] mb-4">
          Hướng dẫn đăng tin bất động sản
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed">
          Để tin đăng thu hút được nhiều khách hàng nhất, vui lòng thực hiện theo quy trình 3 bước tiêu chuẩn dưới đây.
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