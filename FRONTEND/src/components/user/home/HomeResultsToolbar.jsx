import { useEffect, useRef, useState } from 'react';
import AppIcon from '../../common/AppIcon';
import FormFieldLabel from '../../common/FormFieldLabel';
import IconTextButton from '../../common/IconTextButton';

// Toolbar tim kiem va bo loc local tren du lieu bai dang da nhan.
const HomeResultsToolbar = ({
	searchInput,
	onSearchInputChange,
	onSearch,
	draftFilters,
	onDraftFilterChange,
	onApplyFilters,
	onResetFilters,
	activeFilterCount,
	areaOptions,
	propertyTypeOptions,
	listingTypeOptions,
	priceRangeOptions,
	areaRangeOptions,
	legalStatusOptions,
	roomCountOptions,
}) => {
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const containerRef = useRef(null);

	useEffect(() => {
		if (!isFilterOpen) return;

		const handleOutsideClick = (event) => {
			if (!containerRef.current?.contains(event.target)) {
				setIsFilterOpen(false);
			}
		};

		document.addEventListener('mousedown', handleOutsideClick);
		return () => {
			document.removeEventListener('mousedown', handleOutsideClick);
		};
	}, [isFilterOpen]);

	const filterLabelClassName =
		'mb-2 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#5e6570]';

	return (
		<section className="mx-auto w-full max-w-7xl px-6 pb-10 pt-14 md:px-10">
			<div ref={containerRef} className="relative flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
				<form
					className="group relative w-full md:max-w-2xl"
					onSubmit={(event) => {
						event.preventDefault();
						onSearch();
					}}
				>
					<span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#74777d] transition-colors group-focus-within:text-[#735c00]">
						<AppIcon name="search" className="h-5 w-5" />
					</span>
					<input
						className="h-12 w-full rounded-xl border border-[#e4e2e3] bg-white pl-11 pr-14 text-sm font-medium text-[#1b1c1d] placeholder:text-[#9ba0a7] shadow-sm transition-all focus:border-[#cca830] focus:ring-2 focus:ring-[#cca830]/20"
						placeholder="Tìm kiếm từ khóa bất động sản..."
						type="text"
						value={searchInput}
						onChange={(event) => onSearchInputChange(event.target.value)}
					/>
					<button
						type="submit"
						className="absolute right-1.5 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg bg-[#041627] text-white shadow-md transition-all hover:scale-105 hover:bg-[#0a2a47]"
						aria-label="Tìm kiếm"
						title="Tìm kiếm"
					>
						<AppIcon name="search" className="h-4 w-4" />
					</button>
				</form>

				<IconTextButton
					onClick={() => setIsFilterOpen((open) => !open)}
					className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#e4e2e3] bg-white px-5 text-sm font-bold text-[#041627] shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#cca830] hover:text-[#735c00]"
					iconName="filterSliders"
					iconClassName="h-5 w-5"
					after={
						activeFilterCount > 0 ? (
							<span className="inline-flex min-w-6 items-center justify-center rounded-full bg-[#041627] px-1.5 text-[11px] font-extrabold text-white">
								{activeFilterCount}
							</span>
						) : null
					}
				>
					Bộ lọc
				</IconTextButton>

				{isFilterOpen && (
					<div className="absolute right-0 top-14 z-40 w-full max-w-5xl overflow-hidden rounded-2xl border border-[#c4c6cd]/40 bg-white shadow-[0_24px_60px_-30px_rgba(4,22,39,0.5)]">
						<div className="bg-[linear-gradient(135deg,#041627_0%,#123456_100%)] px-6 py-5 text-white">
							<div className="flex flex-wrap items-start justify-between gap-3">
								<div>
									<p className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] text-white/70">
										<AppIcon name="filterSliders" className="h-4 w-4" />
										Smart Filter
									</p>
									<h3 className="mt-1 text-xl font-black [font-family:Noto_Serif]">Bộ lọc chuyên sâu bất động sản</h3>
									<p className="mt-1 text-sm text-[#d4deea]">Chọn nhanh theo khu vực, phân khúc giá và loại hình để tìm đúng sản phẩm.</p>
								</div>
								<IconTextButton
									onClick={() => {
										onResetFilters();
									}}
									className="inline-flex h-10 items-center gap-1 rounded-lg border border-white/25 bg-white/10 px-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-white/20"
									iconName="refresh"
								>
									Đặt lại
								</IconTextButton>
							</div>
						</div>

						<div className="space-y-6 p-6">
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<div>
									<FormFieldLabel
										iconName="locationOn"
										text="Khu vực"
										className={filterLabelClassName}
										iconClassName="h-4 w-4"
									/>
									<input
										list="home-area-options"
										className="h-11 w-full rounded-xl border border-[#e4e2e3] bg-[#f8f7f8] px-3 text-sm font-medium"
										placeholder="Gõ để gợi ý và chọn khu vực..."
										value={draftFilters.areaKeyword}
										onChange={(event) => onDraftFilterChange('areaKeyword', event.target.value)}
									/>
									<datalist id="home-area-options">
										{areaOptions.map((option) => (
											<option key={option} value={option} />
										))}
									</datalist>
								</div>

								<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
									<div>
										<FormFieldLabel
											iconName="homeWork"
											text="Loại bất động sản"
											className={filterLabelClassName}
											iconClassName="h-4 w-4"
										/>
										<select
											className="h-11 w-full rounded-xl border border-[#e4e2e3] bg-[#f8f7f8] px-3 text-sm font-semibold"
											value={draftFilters.propertyType}
											onChange={(event) => onDraftFilterChange('propertyType', event.target.value)}
										>
											{propertyTypeOptions.map((option) => (
												<option key={option.value || 'all-property'} value={option.value}>
													{option.label}
												</option>
											))}
										</select>
									</div>
									<div>
										<FormFieldLabel
											iconName="listingLines"
											text="BĐS bán hay thuê"
											className={filterLabelClassName}
											iconClassName="h-4 w-4"
										/>
										<select
											className="h-11 w-full rounded-xl border border-[#e4e2e3] bg-[#f8f7f8] px-3 text-sm font-semibold"
											value={draftFilters.listingType}
											onChange={(event) => onDraftFilterChange('listingType', event.target.value)}
										>
											{listingTypeOptions.map((option) => (
												<option key={option.value || 'all-listing'} value={option.value}>
													{option.label}
												</option>
											))}
										</select>
									</div>
								</div>
							</div>

							<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
								<div>
									<FormFieldLabel
										iconName="currencyCard"
										text="Khoảng giá"
										className={filterLabelClassName}
										iconClassName="h-4 w-4"
									/>
									<select
										className="h-11 w-full rounded-xl border border-[#e4e2e3] bg-[#f8f7f8] px-3 text-sm font-medium"
										value={draftFilters.priceRange}
										onChange={(event) => onDraftFilterChange('priceRange', event.target.value)}
									>
										{priceRangeOptions.map((option) => (
											<option key={option.value || 'all-price'} value={option.value}>
												{option.label}
											</option>
										))}
									</select>
								</div>
								<div>
									<FormFieldLabel
										iconName="areaSquareGrid"
										text="Diện tích"
										className={filterLabelClassName}
										iconClassName="h-4 w-4"
									/>
									<select
										className="h-11 w-full rounded-xl border border-[#e4e2e3] bg-[#f8f7f8] px-3 text-sm font-medium"
										value={draftFilters.areaRange}
										onChange={(event) => onDraftFilterChange('areaRange', event.target.value)}
									>
										{areaRangeOptions.map((option) => (
											<option key={option.value || 'all-area'} value={option.value}>
												{option.label}
											</option>
										))}
									</select>
								</div>
								<div>
									<FormFieldLabel
										iconName="legalSeal"
										text="Pháp lý"
										className={filterLabelClassName}
										iconClassName="h-4 w-4"
									/>
									<select
										className="h-11 w-full rounded-xl border border-[#e4e2e3] bg-[#f8f7f8] px-3 text-sm font-medium"
										value={draftFilters.legalStatus}
										onChange={(event) => onDraftFilterChange('legalStatus', event.target.value)}
									>
										{legalStatusOptions.map((option) => (
											<option key={option.value || 'all-legal'} value={option.value}>
												{option.label}
											</option>
										))}
									</select>
								</div>
							</div>

							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
								<div>
									<FormFieldLabel
										iconName="bedSimple"
										text="Số phòng ngủ tối thiểu"
										className={filterLabelClassName}
										iconClassName="h-4 w-4"
									/>
									<select
										className="h-11 w-full rounded-xl border border-[#e4e2e3] bg-[#f8f7f8] px-3 text-sm font-medium"
										value={draftFilters.bedrooms}
										onChange={(event) => onDraftFilterChange('bedrooms', event.target.value)}
									>
										{roomCountOptions.map((option) => (
											<option key={`${option.value || 'all-room'}-bed`} value={option.value}>
												{option.value ? option.label.replace('phòng', 'phòng ngủ') : option.label}
											</option>
										))}
									</select>
								</div>
								<div>
									<FormFieldLabel
										iconName="bath"
										text="Số phòng tắm tối thiểu"
										className={filterLabelClassName}
										iconClassName="h-4 w-4"
									/>
									<select
										className="h-11 w-full rounded-xl border border-[#e4e2e3] bg-[#f8f7f8] px-3 text-sm font-medium"
										value={draftFilters.bathrooms}
										onChange={(event) => onDraftFilterChange('bathrooms', event.target.value)}
									>
										{roomCountOptions.map((option) => (
											<option key={`${option.value || 'all-room'}-bath`} value={option.value}>
												{option.value ? option.label.replace('phòng', 'phòng tắm') : option.label}
											</option>
										))}
									</select>
								</div>
							</div>

							<div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#eceaec] pt-4">
								<p className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6d7480]">
									<AppIcon name="clock" className="h-4 w-4" />
									Mẹo: Khu vực dùng gợi ý theo danh sách, hãy chọn 1 giá trị từ option.
								</p>
								<div className="flex items-center gap-2">
									<IconTextButton
										onClick={() => setIsFilterOpen(false)}
										className="inline-flex h-11 items-center gap-1 rounded-xl border border-[#dfe2e7] bg-white px-4 text-sm font-semibold text-[#3f4650] transition hover:border-[#9fa6b2]"
										iconName="chevronLeft"
									>
										Đóng
									</IconTextButton>
									<IconTextButton
										onClick={() => {
											onApplyFilters();
											setIsFilterOpen(false);
										}}
										className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#735c00] px-5 text-sm font-bold text-white transition-colors hover:bg-[#4f3e00]"
										iconName="arrowRight"
									>
										Áp dụng bộ lọc
									</IconTextButton>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</section>
	);
};

export default HomeResultsToolbar;
