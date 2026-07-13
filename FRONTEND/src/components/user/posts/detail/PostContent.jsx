import { formatCurrencyVND } from "../../../../utils/format";
import { 
  LISTING_TYPES, 
  PROPERTY_TYPES, 
  LEGAL_STATUSES 
} from "../../../../constants/posts"; 

export default function PostContent({ post, onAddressClick }) {
  // Hàm bổ trợ để tìm label từ mảng constants
  const getLabel = (list, value) => {
    return list.find((item) => item.value === value)?.label || value;
  };

  const listingLabel = getLabel(LISTING_TYPES, post.listingType);
  const propertyLabel = getLabel(PROPERTY_TYPES, post.propertyType);
  const legalLabel = getLabel(LEGAL_STATUSES, post.legalStatus);

  return (
    <div className="flex-1 space-y-8">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100/50">
        {/* Badges - Lấy từ label tương ứng */}
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="bg-[#cca830] text-white text-[10px] font-bold px-3 py-1 rounded-md uppercase tracking-wider">
            {listingLabel}
          </span>
          <span className="bg-[#041627] text-white text-[10px] font-bold px-3 py-1 rounded-md uppercase tracking-wider">
            {propertyLabel}
          </span>
        </div>
        
        {/* Title & Address */}
        <h1 className="text-3xl font-black text-[#041627] mb-4 [font-family:Noto_Serif] leading-tight">
          {post.title}
        </h1>
        
        <button
          type="button"
          onClick={onAddressClick}
          className="flex items-center gap-2 text-gray-500 text-sm mb-8 hover:text-[#cca830] transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5 text-[#cca830] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-left">
            {post.streetAddress}, {post.wardName}, Đà Nẵng
          </span>
        </button>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 py-8 border-y border-gray-100">
          <StatItem label="Mức giá" value={formatCurrencyVND(post.price)} highlight />
          <StatItem label="Diện tích" value={`${post.area} m²`} />
          <StatItem label="Phòng ngủ" value={post.bedrooms > 0 ? `${post.bedrooms} PN` : "N/A"} />
          <StatItem label="Phòng tắm" value={post.bathrooms > 0 ? `${post.bathrooms} WC` : "N/A"} />
          <StatItem label="Pháp lý" value={legalLabel} />
        </div>

        {/* Description */}
        <div className="mt-10">
          <h3 className="text-xl font-bold text-[#041627] mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-[#cca830] rounded-full"></span>
            Mô tả bài đăng
          </h3>
          <p className="text-gray-600 leading-relaxed whitespace-pre-line text-justify text-sm">
            {post.description}
          </p>
        </div>
      </div>
    </div>
  );
}

function StatItem({ label, value, highlight = false }) {
  return (
    <div className="text-center md:text-left">
      <p className="text-[10px] text-gray-400 uppercase font-black mb-1 tracking-tighter">{label}</p>
      <p className={`text-sm md:text-base font-black ${highlight ? 'text-[#cca830]' : 'text-[#041627]'}`}>
        {value}
      </p>
    </div>
  );
}