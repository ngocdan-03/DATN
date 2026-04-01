import AppIcon from '../../../common/AppIcon';
import FormFieldLabel from '../../../common/FormFieldLabel';

const PostCreatePricingAreaSection = ({
	register,
	errors,
	pricePreview,
	areaPreview,
	legalStatusOptions,
}) => {
	return (
		<section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
			<div className="mb-6 flex items-center gap-3">
				<AppIcon name="currencyCard" className="h-5 w-5 text-blue-700" />
				<h2 className="text-xl font-bold tracking-tight text-slate-900 [font-family:Manrope]">Giá và diện tích</h2>
			</div>

			<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
				<div>
					<FormFieldLabel
						iconName="currencyCard"
						text="Giá bán"
						className="mb-2 inline-flex items-center gap-1.5 text-sm font-extrabold uppercase tracking-wide text-slate-900"
					/>
					<input
						type="number"
						min={0}
						max={999999999999999}
						{...register('price')}
						placeholder="10000000000"
						className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 focus:border-blue-600 focus:ring-blue-600"
					/>
					{pricePreview && <p className="mt-2 text-xs font-semibold text-blue-700">{pricePreview}</p>}
					{errors.price?.message && <p className="mt-2 text-xs font-semibold text-rose-700">{errors.price.message}</p>}
				</div>

				<div>
					<FormFieldLabel
						iconName="areaGrid"
						text="Diện tích"
						className="mb-2 inline-flex items-center gap-1.5 text-sm font-extrabold uppercase tracking-wide text-slate-900"
					/>
					<input
						type="number"
						min={0}
						step="0.1"
						{...register('area')}
						placeholder="100"
						className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 focus:border-blue-600 focus:ring-blue-600"
					/>
					{areaPreview && <p className="mt-2 text-xs font-semibold text-blue-700">{areaPreview}</p>}
					{errors.area?.message && <p className="mt-2 text-xs font-semibold text-rose-700">{errors.area.message}</p>}
				</div>

				<div className="md:col-span-2">
					<FormFieldLabel
						iconName="legalSeal"
						text="Tình trạng pháp lý"
						className="mb-2 inline-flex items-center gap-1.5 text-sm font-extrabold uppercase tracking-wide text-slate-900"
					/>
					<select
						{...register('legalStatus')}
						className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800 focus:border-blue-600 focus:ring-blue-600"
					>
						{legalStatusOptions.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
					{errors.legalStatus?.message && <p className="mt-2 text-xs font-semibold text-rose-700">{errors.legalStatus.message}</p>}
				</div>
			</div>
		</section>
	);
};

export default PostCreatePricingAreaSection;
