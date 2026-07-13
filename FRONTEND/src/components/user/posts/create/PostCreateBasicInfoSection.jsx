import React from 'react';
import { useFormContext } from 'react-hook-form';
import { PROPERTY_TYPES, LISTING_TYPES } from '../../../../constants/posts';

export default function PostCreateBasicInfoSection() {
	const { register, formState: { errors } } = useFormContext();

	return (
		<section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
			<div className="mb-6 flex items-center gap-3">
				<svg className="h-5 w-5 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l6 6v10a2 2 0 01-2 2z" />
				</svg>
				<h2 className="text-xl font-bold tracking-tight text-slate-900 [font-family:Manrope]">Thông tin cơ bản</h2>
			</div>

			<div className="space-y-6">
				{/* TIÊU ĐỀ TIN ĐĂNG */}
				<div>
					<label className="mb-2 inline-flex items-center gap-1.5 text-sm font-extrabold uppercase tracking-wide text-slate-900">
						Tiêu đề tin đăng
					</label>
					<input
						type="text"
						{...register('title')}
						placeholder="VD: Căn hộ cao cấp 2PN trung tâm..."
						className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-blue-600"
					/>
					{errors.title && <p className="mt-2 text-xs font-semibold text-rose-600">{errors.title.message}</p>}
				</div>

				{/* LOẠI BĐS & HÌNH THỨC */}
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					<div>
						<label className="mb-2 inline-flex items-center gap-1.5 text-sm font-extrabold uppercase tracking-wide text-slate-900">
							Loại bất động sản
						</label>
						<select
							{...register('propertyType')}
							className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800 focus:border-blue-600 focus:ring-blue-600"
						>
							{PROPERTY_TYPES.filter(type => type.value !== "").map((type) => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
						</select>
						{errors.propertyType && <p className="mt-2 text-xs font-semibold text-rose-600">{errors.propertyType.message}</p>}
					</div>

					<div>
						<label className="mb-2 inline-flex items-center gap-1.5 text-sm font-extrabold uppercase tracking-wide text-slate-900">
							Hình thức
						</label>
						<select
							{...register('listingType')}
							className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800 focus:border-blue-600 focus:ring-blue-600"
						>
							{LISTING_TYPES.filter(type => type.value !== "").map((type) => (
                                <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
						</select>
						{errors.listingType && <p className="mt-2 text-xs font-semibold text-rose-600">{errors.listingType.message}</p>}
					</div>
				</div>

				{/* MÔ TẢ CHI TIẾT */}
				<div>
					<label className="mb-2 inline-flex items-center gap-1.5 text-sm font-extrabold uppercase tracking-wide text-slate-900">
						Mô tả chi tiết
					</label>
					<textarea
					rows={15}
					{...register('description')}
					placeholder="Mô tả đặc điểm nổi bật, vị trí, tiện ích xung quanh..."
					className="w-full min-h-[600px] rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-blue-600"
					/>
					{errors.description && <p className="mt-2 text-xs font-semibold text-rose-600">{errors.description.message}</p>}
				</div>
			</div>
		</section>
	);
}