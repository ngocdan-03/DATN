import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

export default function PostCreateMediaSection() {
    const { setValue, watch, formState: { errors }, clearErrors } = useFormContext();

    const thumbnailInputRef = useRef(null);
    const galleryInputRef = useRef(null);

    // 1. Lấy trực tiếp File từ React Hook Form
    const currentThumbnail = watch('thumbnailUrl');
    const currentGallery = watch('imageUrls');

    const [galleryIndex, setGalleryIndex] = useState(0);

    // ==========================================
    // 2. DÙNG useMemo ĐỂ TẠO URL ẢO TRỰC TIẾP (KHÔNG DÙNG useState)
    // ==========================================
    const thumbnailPreview = useMemo(() => {
    if (!currentThumbnail) return null;
    if (currentThumbnail instanceof Blob) return URL.createObjectURL(currentThumbnail);
    if (typeof currentThumbnail === 'string') return currentThumbnail; 
    }, [currentThumbnail]);

    const galleryPreviews = useMemo(() => {
    if (!currentGallery || !Array.isArray(currentGallery)) return [];
    return currentGallery.map((item) => {
        if (item instanceof Blob) return URL.createObjectURL(item);
        if (typeof item === 'string') return item; 
        return null;
    }).filter(Boolean);
    }, [currentGallery]);

    // ==========================================
    // 3. CHỈ DÙNG useEffect ĐỂ DỌN RÁC RAM VÀ XÓA INPUT
    // ==========================================
    useEffect(() => {
        if (!currentThumbnail && thumbnailInputRef.current) {
            thumbnailInputRef.current.value = '';
        }
        return () => {
            if (thumbnailPreview && thumbnailPreview.startsWith('blob:')) {
                URL.revokeObjectURL(thumbnailPreview);
            }
        };
    }, [currentThumbnail, thumbnailPreview]);

    useEffect(() => {
        if ((!currentGallery || currentGallery.length === 0) && galleryInputRef.current) {
            galleryInputRef.current.value = '';
        }
        return () => {
            galleryPreviews.forEach(url => {
                if (url && url.startsWith('blob:')) URL.revokeObjectURL(url);
            });
        };
    }, [currentGallery, galleryPreviews]);

    // ==========================================
    // CÁC HÀM XỬ LÝ (CHỈ BƠM FILE VÀO HOOK FORM)
    // ==========================================
    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file && file instanceof Blob) {
            setValue('thumbnailUrl', file, { shouldValidate: true });
            clearErrors('thumbnailUrl');
        }
    };

    const handleGalleryChange = (e) => {
        const files = Array.from(e.target.files).filter(f => f instanceof Blob);
        if (files.length > 0) {
            const safeCurrentGallery = Array.isArray(currentGallery) ? currentGallery : [];
            const newGallery = [...safeCurrentGallery, ...files];
            setValue('imageUrls', newGallery, { shouldValidate: true });
            clearErrors('imageUrls');
        }
    };

    const handleClearGallery = () => {
        setValue('imageUrls', [], { shouldValidate: true });
        setGalleryIndex(0);
    };

    const handlePrev = () => setGalleryIndex((i) => (i - 1 + galleryPreviews.length) % galleryPreviews.length);
    const handleNext = () => setGalleryIndex((i) => (i + 1) % galleryPreviews.length);

    const handleRemove = (index) => {
        const safeCurrentGallery = Array.isArray(currentGallery) ? currentGallery : [];
        console.log('=== TRUOC XOA ===', safeCurrentGallery);
        console.log('XOA index:', index, 'item:', safeCurrentGallery[index]);
        const newGallery = safeCurrentGallery.filter((_, i) => i !== index);
        console.log('=== SAU XOA ===', newGallery);
        setValue('imageUrls', newGallery, { shouldValidate: true });
        setGalleryIndex((i) => Math.min(i, Math.max(0, newGallery.length - 1)));
    };

    const safeIndex = galleryPreviews.length ? Math.min(galleryIndex, galleryPreviews.length - 1) : 0;

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
            <div className="mb-6 flex items-center gap-3">
                <svg className="h-5 w-5 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                </svg>
                <h2 className="text-xl font-bold tracking-tight text-slate-900 [font-family:Manrope]">Hình ảnh</h2>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* ẢNH ĐẠI DIỆN */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="inline-flex items-center gap-1.5 text-sm font-extrabold uppercase tracking-wide text-slate-900">
                            Ảnh chính đại diện
                        </label>
                    </div>

                    <div className={`rounded-2xl border border-dashed ${errors.thumbnailUrl ? 'border-rose-500 bg-rose-50' : 'border-slate-300 bg-slate-50'} p-4`}>
                        <input
                            ref={thumbnailInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleThumbnailChange}
                            className="block w-full cursor-pointer rounded-xl border border-slate-300 bg-white p-2 text-sm font-semibold text-slate-700 file:mr-3 file:rounded-lg file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                        />
                        {errors.thumbnailUrl && <p className="mt-2 text-xs font-semibold text-rose-600">{errors.thumbnailUrl.message}</p>}
                        <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                            {thumbnailPreview ? (
                                <img alt="Thumbnail preview" className="h-48 w-full object-cover" src={thumbnailPreview} />
                            ) : (
                                <div className="flex h-48 items-center justify-center text-sm font-semibold text-slate-500">Chưa chọn thumbnail</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ẢNH CHI TIẾT */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                        <label className="inline-flex items-center gap-1.5 text-sm font-extrabold uppercase tracking-wide text-slate-900">
                            Ảnh chi tiết bài đăng
                        </label>
                        <button
                            type="button"
                            onClick={handleClearGallery}
                            disabled={!galleryPreviews.length}
                            className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-rose-700 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Bỏ chọn tất cả
                        </button>
                    </div>

                    <div className={`rounded-2xl border border-dashed ${errors.imageUrls ? 'border-rose-500 bg-rose-50' : 'border-slate-300 bg-slate-50'} p-4`}>
                        <input
                            ref={galleryInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            multiple
                            onChange={handleGalleryChange}
                            className="block w-full cursor-pointer rounded-xl border border-slate-300 bg-white p-2 text-sm font-semibold text-slate-700 file:mr-3 file:rounded-lg file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                        />
                        {errors.imageUrls && <p className="mt-2 text-xs font-semibold text-rose-600">{errors.imageUrls.message}</p>}

                        <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white">
                            <div className="relative aspect-video border-b border-slate-200 bg-slate-900">
                                {galleryPreviews.length > 0 ? (
                                    <img alt="Gallery preview" className="h-full w-full object-cover" src={galleryPreviews[safeIndex]} />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-sm font-semibold text-slate-300">Chưa chọn ảnh gallery</div>
                                )}
                                <button type="button" onClick={handlePrev} disabled={galleryPreviews.length < 2} className="absolute left-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/60 text-white disabled:opacity-40">‹</button>
                                <button type="button" onClick={handleNext} disabled={galleryPreviews.length < 2} className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/60 text-white disabled:opacity-40">›</button>
                            </div>

                            <div className="flex gap-2 overflow-x-auto p-3">
                                {galleryPreviews.map((previewUrl, index) => (
                                    <div className="relative h-[72px] w-[72px] flex-none" key={index}>
                                        <button type="button" onClick={() => setGalleryIndex(index)} className={`h-full w-full overflow-hidden rounded-lg border-2 ${index === safeIndex ? 'border-blue-600' : 'border-transparent'} bg-slate-100`}>
                                            <img alt={`Preview ${index}`} className="h-full w-full object-cover" src={previewUrl} />
                                        </button>
                                        <button type="button" onClick={() => handleRemove(index)} className="absolute -right-1.5 -top-1.5 h-5 w-5 rounded-full bg-rose-600 text-white shadow hover:bg-rose-700">×</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}