import { formatCurrencyVND } from "../../../utils/format";
import { Link } from "react-router-dom";

export default function PostCard({ item, onAddressClick }) {
    const detailPath = `/posts/${item.id}`;

  return (
    <div className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:shadow-xl">
      {/* Thumbnail */}
      <Link to={detailPath}>
        <div className="relative aspect-[16/10] overflow-hidden">
            <img
            src={item.thumbnailUrl}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute left-3 top-3 rounded-lg bg-[#041627]/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
            {item.propertyType === 'HOUSE' ? 'Nhà ở' : item.propertyType === 'APARTMENT' ? 'Căn hộ' : 'Đất nền'}
            </div>
        </div>
      </Link>
      {/* Content */}
      <div className="p-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xl font-black text-[#cca830]">
            {formatCurrencyVND(item.price)}
            {item.listingType === 'RENT' && <span className="text-xs text-gray-400 font-normal"> / tháng</span>}
          </span>
          <span className="text-sm font-bold text-[#041627]">{item.area} m²</span>
        </div>

        <h3 className="mb-3 line-clamp-2 h-12 text-sm font-bold leading-snug text-[#1b1c1d] group-hover:text-[#cca830]">
          {item.title}
        </h3>

        <div className="mb-4 flex items-center gap-1 text-[#74777d]">
          <button
            type="button"
            onClick={onAddressClick}
            className="mb-4 flex w-full items-center gap-1 text-left text-[#74777d] hover:text-[#041627]"
          >
            <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            <span className="truncate text-xs">
              {item.streetAddress}, {item.wardName}, Đà Nẵng
            </span>
          </button>
        </div>

        {/* Specs */}
        <div className="flex items-center gap-4 border-t border-gray-100 pt-4">
          <div className="flex items-center gap-1.5 text-xs font-medium text-[#5e6570]">
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {item.bedrooms} PN
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-[#5e6570]">
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {item.bathrooms} PT
          </div>
          <div className="ml-auto text-[10px] font-bold text-gray-300 uppercase">{item.displayDate}</div>
        </div>
      </div>
    </div>
  );
}