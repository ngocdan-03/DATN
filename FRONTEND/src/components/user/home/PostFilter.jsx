import { useEffect, useRef, useState } from 'react';

import { 
    PROPERTY_TYPES, 
    LISTING_TYPES, 
    PRICE_RANGES, 
    AREA_RANGES, 
    LEGAL_STATUSES, 
    ROOMCOUNTS, 
    BATHCOUNTS,
    DANANG_AREAS,
    getAreaBoundaries,
    getPriceBoundaries 
} from '../../../constants/posts';


export default function HomeFilter({ onApply }) {
    // State quản lý UI nội bộ
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const containerRef = useRef(null);

    // State lưu giá trị đang chọn (dùng tạm để UI có tương tác)
    const [draftFilters, setDraftFilters] = useState({
        areaKeyword: '',
        propertyType: '',
        listingType: '',
        priceRange: '',
        areaRange: '',
        legalStatus: '',
        bedrooms: '',
        bathrooms: ''
    });

    // Đếm số lượng bộ lọc đang được chọn (những trường có value khác rỗng)
    const activeFilterCount = Object.values(draftFilters).filter(val => val !== '').length;

    // Xử lý click ra ngoài để đóng bộ lọc
    useEffect(() => {
        if (!isFilterOpen) return;
        const handleOutsideClick = (event) => {
            if (!containerRef.current?.contains(event.target)) {
                setIsFilterOpen(false);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [isFilterOpen]);

    // Hàm đổi state tạm thời
    const handleFilterChange = (key, value) => {
        setDraftFilters(prev => ({ ...prev, [key]: value }));
    };

    // hàm xử lý khi nhấn áp dụng
    const handleApply=() => {
        // lấy min max từ id đã chọn
        const{ minPrice, maxPrice } = getPriceBoundaries(draftFilters.priceRange);
        const{ minArea, maxArea } = getAreaBoundaries(draftFilters.areaRange);
        // gom lại thành object filter cuối cùng để gọi API
        const finalDataToAPI = {
            ...draftFilters,
            minPrice,
            maxPrice,
            minArea,
            maxArea,
        };
        // gọi hàm onApply được truyền từ component cha
        if(onApply) onApply(finalDataToAPI);
        // đóng bộ lọc sau khi áp dụng
        setIsFilterOpen(false);
    };

    const filterLabelClassName = 'mb-2 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#5e6570]';

    return (
        <section className="mx-auto w-full max-w-7xl px-6 pb-10 pt-14 md:px-10">
            <div ref={containerRef} className="relative flex items-center justify-end">
                
                {/* Nút bật/tắt Bộ lọc */}
                <button
                    type="button"
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#e4e2e3] bg-white px-5 text-sm font-bold text-[#041627] shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#cca830] hover:text-[#735c00]"
                >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                    Bộ lọc
                    {activeFilterCount > 0 && (
                        <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-[#041627] px-1.5 text-[11px] font-extrabold text-white">
                            {activeFilterCount}
                        </span>
                    )}
                </button>

                {/* Khung Dropdown Bộ lọc */}
                {isFilterOpen && (
                    <div className="absolute right-0 top-14 z-40 w-full max-w-5xl overflow-hidden rounded-2xl border border-[#c4c6cd]/40 bg-white shadow-[0_24px_60px_-30px_rgba(4,22,39,0.5)]">
                        {/* Header của Bộ lọc */}
                        <div className="bg-[linear-gradient(135deg,#041627_0%,#123456_100%)] px-6 py-5 text-white">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <p className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] text-white/70">
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                        </svg>
                                        Smart Filter
                                    </p>
                                    <h3 className="mt-1 text-xl font-black [font-family:Noto_Serif]">Bộ lọc chuyên sâu bất động sản</h3>
                                    <p className="mt-1 text-sm text-[#d4deea]">Chọn nhanh theo khu vực, phân khúc giá và loại hình để tìm đúng sản phẩm.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setDraftFilters({ areaKeyword: '', propertyType: '', listingType: '', priceRange: '', areaRange: '', legalStatus: '', bedrooms: '', bathrooms: '' })}
                                    className="inline-flex h-10 items-center gap-1 rounded-lg border border-white/25 bg-white/10 px-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-white/20"
                                >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Đặt lại
                                </button>
                            </div>
                        </div>

                        {/* Nội dung các trường lọc */}
                        <div className="space-y-6 p-6">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {/* Khu vực */}
                                <div>
                                    <label className={filterLabelClassName}>
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Khu vực
                                    </label>
                                    <select
                                        className="h-11 w-full rounded-xl border border-[#e4e2e3] bg-[#f8f7f8] px-3 text-sm font-semibold outline-none focus:border-[#cca830]"
                                        value={draftFilters.areaKeyword}
                                        onChange={(e) => handleFilterChange('areaKeyword', e.target.value)}
                                    >
                                        {DANANG_AREAS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                    </select>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {/* Loại BĐS */}
                                    <div>
                                        <label className={filterLabelClassName}>
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                            </svg>
                                            Loại bất động sản
                                        </label>
                                        <select
                                            className="h-11 w-full rounded-xl border border-[#e4e2e3] bg-[#f8f7f8] px-3 text-sm font-semibold outline-none focus:border-[#cca830]"
                                            value={draftFilters.propertyType}
                                            onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                                        >
                                            {PROPERTY_TYPES.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                        </select>
                                    </div>
                                    {/* Bán hay thuê */}
                                    <div>
                                        <label className={filterLabelClassName}>
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                            BĐS bán hay thuê
                                        </label>
                                        <select
                                            className="h-11 w-full rounded-xl border border-[#e4e2e3] bg-[#f8f7f8] px-3 text-sm font-semibold outline-none focus:border-[#cca830]"
                                            value={draftFilters.listingType}
                                            onChange={(e) => handleFilterChange('listingType', e.target.value)}
                                        >
                                            {LISTING_TYPES.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {/* Khoảng giá */}
                                <div>
                                    <label className={filterLabelClassName}>
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Khoảng giá
                                    </label>
                                    <select
                                        className="h-11 w-full rounded-xl border border-[#e4e2e3] bg-[#f8f7f8] px-3 text-sm font-medium outline-none focus:border-[#cca830]"
                                        value={draftFilters.priceRange}
                                        onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                                    >
                                        {PRICE_RANGES.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                    </select>
                                </div>
                                {/* Diện tích */}
                                <div>
                                    <label className={filterLabelClassName}>
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                        </svg>
                                        Diện tích
                                    </label>
                                    <select
                                        className="h-11 w-full rounded-xl border border-[#e4e2e3] bg-[#f8f7f8] px-3 text-sm font-medium outline-none focus:border-[#cca830]"
                                        value={draftFilters.areaRange}
                                        onChange={(e) => handleFilterChange('areaRange', e.target.value)}
                                    >
                                        {AREA_RANGES.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                    </select>
                                </div>
                                {/* Pháp lý */}
                                <div>
                                    <label className={filterLabelClassName}>
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                        Pháp lý
                                    </label>
                                    <select
                                        className="h-11 w-full rounded-xl border border-[#e4e2e3] bg-[#f8f7f8] px-3 text-sm font-medium outline-none focus:border-[#cca830]"
                                        value={draftFilters.legalStatus}
                                        onChange={(e) => handleFilterChange('legalStatus', e.target.value)}
                                    >
                                        {LEGAL_STATUSES.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {/* Phòng ngủ */}
                                <div>
                                    <label className={filterLabelClassName}>
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                        Số phòng ngủ tối thiểu
                                    </label>
                                    <select
                                        className="h-11 w-full rounded-xl border border-[#e4e2e3] bg-[#f8f7f8] px-3 text-sm font-medium outline-none focus:border-[#cca830]"
                                        value={draftFilters.bedrooms}
                                        onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                                    >
                                        {ROOMCOUNTS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                    </select>
                                </div>
                                {/* Phòng tắm */}
                                <div>
                                    <label className={filterLabelClassName}>
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                        Số phòng tắm tối thiểu
                                    </label>
                                    <select
                                        className="h-11 w-full rounded-xl border border-[#e4e2e3] bg-[#f8f7f8] px-3 text-sm font-medium outline-none focus:border-[#cca830]"
                                        value={draftFilters.bathrooms}
                                        onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                                    >
                                        {BATHCOUNTS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Actions Footer */}
                            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#eceaec] pt-4">
                                <p className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6d7480]">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Mẹo: Hãy kết hợp các bộ lọc để tìm được bất động sản đúng nhu cầu nhất.
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsFilterOpen(false)}
                                        className="inline-flex h-11 items-center gap-1 rounded-xl border border-[#dfe2e7] bg-white px-4 text-sm font-semibold text-[#3f4650] transition hover:border-[#9fa6b2]"
                                    >
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                        Đóng
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleApply}
                                        className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#735c00] px-5 text-sm font-bold text-white transition-colors hover:bg-[#4f3e00]"
                                    >
                                        Áp dụng bộ lọc
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}