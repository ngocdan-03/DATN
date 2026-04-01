import AppIcon from '../../../common/AppIcon';
import FormFieldLabel from '../../../common/FormFieldLabel';

const PostCreateBasicInfoSection = ({
	register,
	errors,
	propertyTypeField,
	onPropertyTypeChange,
	propertyTypeOptions,
	listingTypeOptions,
}) => {
	return (
		<section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
			<div className="mb-6 flex items-center gap-3">
				<AppIcon name="article" className="h-5 w-5 text-blue-700" />
				<h2 className="text-xl font-bold tracking-tight text-slate-900 [font-family:Manrope]">Thông tin cơ bản</h2>
			</div>

			<div className="space-y-6">
				<div>
					<FormFieldLabel
						iconName="article"
						text="Tiêu đề tin đăng"
						className="mb-2 inline-flex items-center gap-1.5 text-sm font-extrabold uppercase tracking-wide text-slate-900"
					/>
					<input
						type="text"
						{...register('title')}
						placeholder="VD: Căn hộ cao cấp 2PN trung tâm..."
						className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-blue-600"
					/>
					{errors.title?.message && <p className="mt-2 text-xs font-semibold text-rose-700">{errors.title.message}</p>}
				</div>

				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					<div>
						<FormFieldLabel
							iconName="homeWork"
							text="Loại bất động sản"
							className="mb-2 inline-flex items-center gap-1.5 text-sm font-extrabold uppercase tracking-wide text-slate-900"
						/>
						<select
							{...propertyTypeField}
							onChange={onPropertyTypeChange}
							className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800 focus:border-blue-600 focus:ring-blue-600"
						>
							{propertyTypeOptions.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>
						{errors.propertyType?.message && <p className="mt-2 text-xs font-semibold text-rose-700">{errors.propertyType.message}</p>}
					</div>

					<div>
						<FormFieldLabel
							iconName="storefront"
							text="Hình thức"
							className="mb-2 inline-flex items-center gap-1.5 text-sm font-extrabold uppercase tracking-wide text-slate-900"
						/>
						<select
							{...register('listingType')}
							className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800 focus:border-blue-600 focus:ring-blue-600"
						>
							{listingTypeOptions.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>
						{errors.listingType?.message && <p className="mt-2 text-xs font-semibold text-rose-700">{errors.listingType.message}</p>}
					</div>
				</div>

				<div>
					<FormFieldLabel
						iconName="article"
						text="Mô tả chi tiết"
						className="mb-2 inline-flex items-center gap-1.5 text-sm font-extrabold uppercase tracking-wide text-slate-900"
					/>
					<textarea
						rows={6}
						{...register('description')}
						placeholder="Mô tả đặc điểm nổi bật, vị trí, tiện ích xung quanh..."
						className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-blue-600"
					/>
					{errors.description?.message && <p className="mt-2 text-xs font-semibold text-rose-700">{errors.description.message}</p>}
				</div>
			</div>
		</section>
	);
};

export default PostCreateBasicInfoSection;
