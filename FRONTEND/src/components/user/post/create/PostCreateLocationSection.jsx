import AppIcon from '../../../common/AppIcon';
import FormFieldLabel from '../../../common/FormFieldLabel';

const PostCreateLocationSection = ({ register, errors, wardOptions, isLand }) => {
	return (
		<section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
			<div className="mb-6 flex items-center gap-3">
				<AppIcon name="locationOn" className="h-5 w-5 text-blue-700" />
				<h2 className="text-xl font-bold tracking-tight text-slate-900 [font-family:Manrope]">Vị trí và tiện ích</h2>
			</div>

			<div className="space-y-6">
				<div>
					<FormFieldLabel
						iconName="locationOn"
						text="Phường/Xã"
						className="mb-2 inline-flex items-center gap-1.5 text-sm font-extrabold uppercase tracking-wide text-slate-900"
					/>
					<select
						{...register('wardId')}
						className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800 focus:border-blue-600 focus:ring-blue-600"
					>
						{wardOptions.map((option) => (
							<option key={option.id} value={option.id}>
								{option.label}
							</option>
						))}
					</select>
					{errors.wardId?.message && <p className="mt-2 text-xs font-semibold text-rose-700">{errors.wardId.message}</p>}
				</div>

				<div>
					<FormFieldLabel
						iconName="locationOn"
						text="Số nhà, tên đường"
						className="mb-2 inline-flex items-center gap-1.5 text-sm font-extrabold uppercase tracking-wide text-slate-900"
					/>
					<input
						type="text"
						{...register('streetAddress')}
						placeholder="VD: K123 Nguyễn Lương Bằng"
						className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 focus:border-blue-600 focus:ring-blue-600"
					/>
					{errors.streetAddress?.message && <p className="mt-2 text-xs font-semibold text-rose-700">{errors.streetAddress.message}</p>}
				</div>

				{!isLand && (
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
						<div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
							<FormFieldLabel
								iconName="bed"
								text="Phòng ngủ"
								className="mb-2 inline-flex items-center gap-1.5 text-sm font-extrabold uppercase tracking-wide text-slate-900"
							/>
							<input
								type="number"
								min={0}
								{...register('bedrooms')}
								className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 focus:border-blue-600 focus:ring-blue-600"
							/>
							{errors.bedrooms?.message && <p className="mt-2 text-xs font-semibold text-rose-700">{errors.bedrooms.message}</p>}
						</div>
						<div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
							<FormFieldLabel
								iconName="bath"
								text="Phòng tắm"
								className="mb-2 inline-flex items-center gap-1.5 text-sm font-extrabold uppercase tracking-wide text-slate-900"
							/>
							<input
								type="number"
								min={0}
								{...register('bathrooms')}
								className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 focus:border-blue-600 focus:ring-blue-600"
							/>
							{errors.bathrooms?.message && <p className="mt-2 text-xs font-semibold text-rose-700">{errors.bathrooms.message}</p>}
						</div>
					</div>
				)}
			</div>
		</section>
	);
};

export default PostCreateLocationSection;
