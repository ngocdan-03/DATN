import { Link } from "react-router-dom";
import { IMAGES, FOOTER_LINKS, CONTACT_INFO } from "../../constants/system";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-[#f8fafc] text-[#1b1c1d]">
      <div className="mx-auto max-w-6xl px-6 pb-8 pt-16 md:px-10 lg:px-12">
        <div className="grid items-stretch gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex h-full items-start gap-4">
            <img
                src={IMAGES.LOGO}
                alt="RecoLand Logo"
                className="h-30 w-auto shrink-0 object-contain"
            />            
          </div>

            <div>
            <h4 className="text-lg font-semibold text-[#041627]">REAL ESTATE</h4>
            <p className="mt-5 space-y-3 text-sm text-slate-600">
            Đồng hành cùng bạn trên hành trình tìm kiếm bất động sản nhanh chóng, minh bạch và hiệu quả hơn.
            </p>
            </div>

          <div className="flex h-full flex-col">
            <h4 className="text-lg font-semibold text-[#041627]">Khám phá</h4>
            <ul className="mt-5 space-y-3 text-sm text-slate-600">
              {FOOTER_LINKS.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="transition hover:text-[#735c00]">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex h-full flex-col">
            <h4 className="text-lg font-semibold text-[#041627]">Thông tin liên hệ</h4>
            <ul className="mt-5 space-y-3 text-sm text-slate-600">
              <li>Hotline: {CONTACT_INFO.hotline}</li>
              <li>Email: {CONTACT_INFO.email}</li>
              <li>Địa chỉ: {CONTACT_INFO.address}</li>
              <li>Giờ làm việc: {CONTACT_INFO.workingHours}</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}