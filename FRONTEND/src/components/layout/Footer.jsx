import AppIcon from '../common/AppIcon';

// Footer gioi thieu thong tin thuong hieu va lien he.
const Footer = () => {
    return (
        <footer className="bg-[#041627] pb-10 pt-20 text-sm tracking-wide text-[#fbf9fa] [font-family:Manrope]">
            <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-12 px-6 md:grid-cols-4 md:px-12">
                <div className="col-span-1">
                    <span className="mb-6 block text-3xl text-[#cca830] [font-family:Noto_Serif]">RecoLand</span>
                    <p className="mb-8 leading-relaxed text-[#e4e2e3] opacity-60">
                        Đơn vị tư vấn, phân phối và đầu tư bất động sản trung cao cấp với dữ liệu minh bạch,
                        pháp lý rõ ràng và dịch vụ đồng hành trọn vòng đời tài sản.
                    </p>
                    <div className="flex flex-wrap gap-3 text-[#cca830]">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#cca830]/30 px-3 py-1 text-xs">
                            <AppIcon name="check" className="h-3.5 w-3.5" />
                            Đã xác minh
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#cca830]/30 px-3 py-1 text-xs">
                            <AppIcon name="rentHouse" className="h-3.5 w-3.5" />
                            Căn hộ
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#cca830]/30 px-3 py-1 text-xs">
                            <AppIcon name="group" className="h-3.5 w-3.5" />
                            Cộng đồng
                        </span>
                    </div>
                </div>

                <div>
                    <h4 className="mb-8 text-lg text-[#fbf9fa] [font-family:Noto_Serif]">Khám phá</h4>
                    <ul className="space-y-4">
                        <li className="cursor-pointer text-[#e4e2e3] opacity-60 transition-opacity hover:text-[#fbf9fa] hover:opacity-100">Dự án nổi bật</li>
                        <li className="cursor-pointer text-[#e4e2e3] opacity-60 transition-opacity hover:text-[#fbf9fa] hover:opacity-100">Khu vực đầu tư tiềm năng</li>
                        <li className="cursor-pointer text-[#e4e2e3] opacity-60 transition-opacity hover:text-[#fbf9fa] hover:opacity-100">Báo cáo thị trường</li>
                        <li className="cursor-pointer text-[#e4e2e3] opacity-60 transition-opacity hover:text-[#fbf9fa] hover:opacity-100">Cẩm nang mua nhà</li>
                    </ul>
                </div>

                <div>
                    <h4 className="mb-8 text-lg text-[#fbf9fa] [font-family:Noto_Serif]">Dịch vụ giao dịch</h4>
                    <ul className="space-y-4">
                        <li className="cursor-pointer text-[#e4e2e3] opacity-60 transition-opacity hover:text-[#fbf9fa] hover:opacity-100">Mua bán căn hộ và nhà phố</li>
                        <li className="cursor-pointer text-[#e4e2e3] opacity-60 transition-opacity hover:text-[#fbf9fa] hover:opacity-100">Ký gửi cho thuê</li>
                        <li className="cursor-pointer text-[#e4e2e3] opacity-60 transition-opacity hover:text-[#fbf9fa] hover:opacity-100">Tư vấn pháp lý giao dịch</li>
                        <li className="cursor-pointer text-[#e4e2e3] opacity-60 transition-opacity hover:text-[#fbf9fa] hover:opacity-100">Định giá và chiến lược đầu tư</li>
                    </ul>
                </div>

                <div>
                    <h4 className="mb-8 text-lg text-[#fbf9fa] [font-family:Noto_Serif]">Thông tin liên hệ</h4>
                    <ul className="space-y-4 text-[#e4e2e3] opacity-60">
                        <li className="inline-flex items-center gap-2">
                            <AppIcon name="call" className="h-4 w-4" />
                            Hotline: 0352 290 195
                        </li>
                        <li className="inline-flex items-center gap-2">
                            <AppIcon name="mail" className="h-4 w-4" />
                            Email: buingocdan2003@gmail.com
                        </li>
                        <li className="inline-flex items-center gap-2">
                            <AppIcon name="locationOn" className="h-4 w-4" />
                            Địa chỉ: 94 Nguyễn Lương Bằng, Liên Chiểu, Đà Nẵng
                        </li>
                        <li className="inline-flex items-center gap-2">
                            <AppIcon name="clock" className="h-4 w-4" />
                            Giờ làm việc: 08:30 - 18:00 (Thứ 2 - Thứ 7)
                        </li>
                    </ul>
                </div>
            </div>

            <div className="mx-auto mt-14 flex max-w-[1440px] flex-col gap-3 border-t border-[#e4e2e3]/20 px-6 pt-6 text-xs text-[#e4e2e3] opacity-60 md:flex-row md:items-center md:justify-between md:px-12">
                <p>© 2026 RecoLand. Bảo lưu mọi quyền.</p>
                <p>Chính sách bảo mật | Điều khoản sử dụng | Quy chế đăng tin</p>
            </div>
        </footer>
    );
};

export default Footer;