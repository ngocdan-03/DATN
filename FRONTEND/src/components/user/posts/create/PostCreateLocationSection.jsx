import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { DANANG_AREAS } from '../../../../constants/posts';
import MapPickerModal from '../../../common/MapPickerModal';

export default function PostCreateLocationSection() {
    const { register, watch, setValue, formState: { errors } } = useFormContext();
    const currentPropertyType = watch('propertyType');
    const isLand = currentPropertyType === 'LAND';

    const [showMap, setShowMap] = useState(false);

    // Theo dõi tọa độ hiện tại để hiển thị
    const latitude = watch('latitude');
    const longitude = watch('longitude');

    const handleSelectLocation = ({ latitude, longitude, }) => {
        setValue('latitude', latitude, { shouldValidate: true });
        setValue('longitude', longitude, { shouldValidate: true });
        setShowMap(false);
    };

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
            <div className="mb-6 flex items-center gap-3">
                <svg className="h-5 w-5 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
                </svg>
                <h2 className="text-xl font-bold tracking-tight text-slate-900 [font-family:Manrope]">Vị trí và tiện ích</h2>
            </div>

            <div className="space-y-6">
                {/* PHƯỜNG/XÃ */}
                <div>
                    <label className="mb-2 inline-flex items-center gap-1.5 text-sm font-extrabold uppercase tracking-wide text-slate-900">
                        Phường/Xã
                    </label>
                    <select
                        {...register('wardId')}
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800 focus:border-blue-600 focus:ring-blue-600"
                    >
                        {DANANG_AREAS.filter(option => option.value !== "").map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                    {errors.wardId && <p className="mt-2 text-xs font-semibold text-rose-600">{errors.wardId.message}</p>}
                </div>

                {/* SỐ NHÀ, TÊN ĐƯỜNG */}
                <div>
                    <label className="mb-2 inline-flex items-center gap-1.5 text-sm font-extrabold uppercase tracking-wide text-slate-900">
                        Số nhà, tên đường
                    </label>
                    <input
                        type="text"
                        {...register('streetAddress')}
                        placeholder="VD: K123 Nguyễn Lương Bằng"
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 focus:border-blue-600 focus:ring-blue-600"
                    />
                    {errors.streetAddress && <p className="mt-2 text-xs font-semibold text-rose-600">{errors.streetAddress.message}</p>}
                </div>

                {/* CHỌN VỊ TRÍ TRÊN BẢN ĐỒ */}
                <div>
                    <label className="mb-2 inline-flex items-center gap-1.5 text-sm font-extrabold uppercase tracking-wide text-slate-900">
                        Vị trí trên bản đồ
                    </label>

                    <button
                        type="button"
                        onClick={() => setShowMap(true)}
                        className="flex w-full items-center justify-between rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 hover:border-blue-500 hover:bg-blue-50"
                    >
                        <span className="flex items-center gap-2">
                            <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {latitude && longitude
                                ? `Đã chọn: ${Number(latitude).toFixed(6)}, ${Number(longitude).toFixed(6)}`
                                : 'Nhấn để chọn vị trí trên bản đồ'}
                        </span>
                        <span className="text-blue-600">{latitude ? 'Đổi lại' : 'Chọn'}</span>
                    </button>

                    {(errors.latitude || errors.longitude) && (
                        <p className="mt-2 text-xs font-semibold text-rose-600">
                            Vui lòng chọn vị trí trên bản đồ
                        </p>
                    )}

                    {/* Hidden inputs để register vào form */}
                    <input type="hidden" {...register('latitude')} />
                    <input type="hidden" {...register('longitude')} />
                </div>

                {/* Phòng ngủ / phòng tắm */}
                {!isLand && (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <label className="mb-2 inline-flex items-center gap-1.5 text-sm font-extrabold uppercase tracking-wide text-slate-900">
                                Phòng ngủ
                            </label>
                            <input
                                type="number"
                                min={0}
                                {...register('bedrooms')}
                                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 focus:border-blue-600 focus:ring-blue-600"
                            />
                            {errors.bedrooms && <p className="mt-2 text-xs font-semibold text-rose-600">{errors.bedrooms.message}</p>}
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <label className="mb-2 inline-flex items-center gap-1.5 text-sm font-extrabold uppercase tracking-wide text-slate-900">
                                Phòng tắm
                            </label>
                            <input
                                type="number"
                                min={0}
                                {...register('bathrooms')}
                                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 focus:border-blue-600 focus:ring-blue-600"
                            />
                            {errors.bathrooms && <p className="mt-2 text-xs font-semibold text-rose-600">{errors.bathrooms.message}</p>}
                        </div>
                    </div>
                )}
            </div>

            {/* Modal chọn bản đồ */}
            {showMap && (
                <MapPickerModal
                    onSelect={handleSelectLocation}
                    onClose={() => setShowMap(false)}
                />
            )}
        </section>
    );
}