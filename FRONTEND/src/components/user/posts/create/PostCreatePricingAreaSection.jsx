import React from 'react';
import { useFormContext } from 'react-hook-form';
import { LEGAL_STATUSES } from '../../../../constants/posts';
import { formatCurrencyVND, formatArea } from '../../../../utils/format';

export default function PostCreatePricingAreaSection() {
	const { register, watch, formState: { errors } } = useFormContext();

	// Theo dõi realtime 2 trường này để format bên dưới
	const currentPrice = watch('price');
	const currentArea = watch('area');

	return (
		<section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
			<div className="mb-6 flex items-center gap-3">
				<svg className="h-5 w-5 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
					<path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
				</svg>
				<h2 className="text-xl font-bold tracking-tight text-slate-900 [font-family:Manrope]">Giá và diện tích</h2>
			</div>

			<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
				{/* GIÁ BÁN */}
				<div>
					<label className="mb-2 inline-flex items-center gap-1.5 text-sm font-extrabold uppercase tracking-wide text-slate-900">
						Giá bán
					</label>
					<input
						type="number"
						min={0}
						max={999999999999999}
						{...register('price')}
						placeholder="VD: 5000000000"
						className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 focus:border-blue-600 focus:ring-blue-600"
					/>
					{/* Hiển thị format tiền tệ realtime */}
					{currentPrice && formatCurrencyVND(currentPrice) && (
						<p className="mt-1 text-xs font-bold text-blue-700">{formatCurrencyVND(currentPrice)}</p>
					)}
					{errors.price && <p className="mt-2 text-xs font-semibold text-rose-600">{errors.price.message}</p>}
				</div>

				{/* DIỆN TÍCH */}
				<div>
					<label className="mb-2 inline-flex items-center gap-1.5 text-sm font-extrabold uppercase tracking-wide text-slate-900">
						Diện tích
					</label>
					<input
						type="number"
						min={0}
						step="0.1"
						{...register('area')}
						placeholder="VD: 100"
						className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 focus:border-blue-600 focus:ring-blue-600"
					/>
					{currentArea && formatArea(currentArea) && (
						<p className="mt-1 text-xs font-bold text-blue-700">{formatArea(currentArea)}</p>
					)}
					{errors.area && <p className="mt-2 text-xs font-semibold text-rose-600">{errors.area.message}</p>}
				</div>

				{/* PHÁP LÝ */}
				<div className="md:col-span-2">
					<label className="mb-2 inline-flex items-center gap-1.5 text-sm font-extrabold uppercase tracking-wide text-slate-900">
						Tình trạng pháp lý
					</label>
					<select
						{...register('legalStatus')}
						className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800 focus:border-blue-600 focus:ring-blue-600"
					>
						{LEGAL_STATUSES.filter((o) => o.value !== '').map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
					</select>
					{errors.legalStatus && <p className="mt-2 text-xs font-semibold text-rose-600">{errors.legalStatus.message}</p>}
				</div>
			</div>
		</section>
	);
}