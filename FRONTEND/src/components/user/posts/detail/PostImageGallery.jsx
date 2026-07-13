import { useState } from 'react';

const PostImageGallery = ({ images = [] }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    // Xử lý khi không có ảnh
    if (!images || images.length === 0) {
        return (
            <div className="h-[400px] w-full rounded-3xl bg-gray-100 flex items-center justify-center text-gray-400">
                Không có hình ảnh bài đăng
            </div>
        );
    }

    // Hàm điều hướng
    const handlePrev = () => {
        setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const goToImage = (index) => {
        setActiveIndex(index);
    };

    return (
        <section className="rounded-3xl border border-[#e4e2e3] bg-white p-3 shadow-[0_24px_50px_-30px_rgba(4,22,39,0.3)]">
            {/* 1. Ảnh chính lớn */}
            <div className="relative aspect-video md:aspect-[16/10] overflow-hidden rounded-2xl bg-gray-50">
                <img 
                    alt="Ảnh bất động sản chi tiết" 
                    className="h-full w-full object-cover transition-all duration-700"
                    src={images[activeIndex]} 
                />
                
                {/* Overlay chỉ số ảnh */}
                <div className="absolute bottom-4 left-4">
                    <p className="rounded-full bg-black/50 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-md">
                        {activeIndex + 1} / {images.length}
                    </p>
                </div>

                {/* Nút điều hướng đè lên ảnh (Kiểu cao cấp) */}
                <div className="absolute inset-y-0 flex w-full items-center justify-between px-4 opacity-0 transition-opacity hover:opacity-100">
                    <button onClick={handlePrev} className="h-10 w-10 rounded-full bg-white/90 text-[#041627] shadow-lg hover:bg-[#cca830] hover:text-white transition-all">
                        <svg className="mx-auto h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button onClick={handleNext} className="h-10 w-10 rounded-full bg-white/90 text-[#041627] shadow-lg hover:bg-[#cca830] hover:text-white transition-all">
                        <svg className="mx-auto h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>
            </div>

            {/* 2. Danh sách Thumbnail bên dưới */}
            <div className="mt-4 flex items-center gap-3">
                <div className="flex flex-1 items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {images.map((url, index) => {
                        const isActive = index === activeIndex;
                        return (
                            <button
                                key={`${url}-${index}`}
                                type="button"
                                onClick={() => goToImage(index)}
                                className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                                    isActive ? 'border-[#cca830] shadow-md scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                                }`}
                            >
                                <img alt={`Thumbnail ${index}`} className="h-full w-full object-cover" src={url} />
                                {isActive && <div className="absolute inset-0 bg-[#cca830]/10" />}
                            </button>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default PostImageGallery;