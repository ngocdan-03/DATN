import AppIcon from '../../../common/AppIcon';
import FormFieldLabel from '../../../common/FormFieldLabel';
import IconTextButton from '../../../common/IconTextButton';

const PostCreateMediaSection = ({
	thumbnailInputKey,
	galleryInputKey,
	thumbnailPreview,
	galleryMainPreview,
	galleryFiles,
	safeGalleryIndex,
	errors,
	onThumbnailChange,
	onGalleryChange,
	onClearGallery,
	onPrev,
	onNext,
	onSelectGalleryIndex,
	onRemoveGalleryFile,
}) => {
	return (
		<section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
			<div className="mb-6 flex items-center gap-3">
				<AppIcon name="article" className="h-5 w-5 text-blue-700" />
				<h2 className="text-xl font-bold tracking-tight text-slate-900 [font-family:Manrope]">Hình ảnh</h2>
			</div>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				<div className="space-y-3">
					<div className="flex items-center justify-between">
						<FormFieldLabel
							iconName="article"
							text="Ảnh chính đại diện"
							className="inline-flex items-center gap-1.5 text-sm font-extrabold uppercase tracking-wide text-slate-900"
						/>
						<span className="rounded-full bg-blue-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-blue-800">1 ảnh</span>
					</div>

					<div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
						<input
							key={thumbnailInputKey}
							id="thumbnailFile"
							type="file"
							accept="image/jpeg,image/png,image/webp"
							onChange={onThumbnailChange}
							className="block w-full cursor-pointer rounded-xl border border-slate-300 bg-white p-2 text-sm font-semibold text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-xs file:font-bold file:uppercase file:tracking-wide file:text-white hover:file:bg-blue-700"
						/>
						<div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
							{thumbnailPreview ? (
								<img alt="Thumbnail preview" className="h-48 w-full object-cover" src={thumbnailPreview} />
							) : (
								<div className="flex h-48 items-center justify-center text-sm font-semibold text-slate-500">Chưa chọn thumbnail</div>
							)}
						</div>
					</div>
					{errors.thumbnailUrl?.message && <p className="text-xs font-semibold text-rose-700">{errors.thumbnailUrl.message}</p>}
				</div>

				<div className="space-y-3">
					<div className="flex items-center justify-between gap-3">
						<div className="flex items-center gap-2">
							<FormFieldLabel
								iconName="article"
								text="Ảnh chi tiết bài đăng"
								className="inline-flex items-center gap-1.5 text-sm font-extrabold uppercase tracking-wide text-slate-900"
							/>
							<span className="rounded-full bg-blue-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-blue-800">Nhiều ảnh</span>
						</div>
						<IconTextButton
							onClick={onClearGallery}
							disabled={!galleryFiles.length}
							className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-rose-700 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
							iconName="searchMinus"
							iconClassName="h-3.5 w-3.5"
						>
							Bỏ chọn tất cả
						</IconTextButton>
					</div>

					<div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
						<input
							key={galleryInputKey}
							id="imageFiles"
							type="file"
							accept="image/jpeg,image/png,image/webp"
							multiple
							onChange={onGalleryChange}
							className="block w-full cursor-pointer rounded-xl border border-slate-300 bg-white p-2 text-sm font-semibold text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-xs file:font-bold file:uppercase file:tracking-wide file:text-white hover:file:bg-blue-700"
						/>

						<div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white">
							<div className="relative aspect-video border-b border-slate-200 bg-slate-900">
								{galleryMainPreview ? (
									<img alt="Gallery preview" className="h-full w-full object-cover" src={galleryMainPreview} />
								) : (
									<div className="flex h-full items-center justify-center text-sm font-semibold text-slate-300">Chưa chọn ảnh gallery</div>
								)}

								<IconTextButton
									onClick={onPrev}
									disabled={galleryFiles.length < 2}
									className="absolute left-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-40"
									iconName="chevronLeft"
									iconClassName="h-5 w-5"
								/>
								<IconTextButton
									onClick={onNext}
									disabled={galleryFiles.length < 2}
									className="absolute right-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-40"
									iconName="chevronRight"
									iconClassName="h-5 w-5"
								/>
								<div className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-1 text-[11px] font-bold text-white">
									{galleryFiles.length ? `${safeGalleryIndex + 1}/${galleryFiles.length}` : '0/0'}
								</div>
							</div>

							<div className="flex gap-2 overflow-x-auto p-3">
								{galleryFiles.map((file, index) => {
									const thumbPreview = URL.createObjectURL(file);
									return (
										<div className="relative h-[72px] w-[72px] flex-none" key={`${file.name}-${file.lastModified}`}>
											<button
												type="button"
												onClick={() => onSelectGalleryIndex(index)}
												className={`h-full w-full overflow-hidden rounded-lg border-2 ${index === safeGalleryIndex ? 'border-blue-600' : 'border-transparent'} bg-slate-100`}
											>
												<img
													alt={file.name}
													className="h-full w-full object-cover"
													src={thumbPreview}
													onLoad={() => URL.revokeObjectURL(thumbPreview)}
												/>
											</button>
											<button
												type="button"
												onClick={() => onRemoveGalleryFile(index)}
												className="absolute -right-1.5 -top-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-xs font-bold text-white shadow hover:bg-rose-700"
											>
												x
											</button>
										</div>
									);
								})}
							</div>
						</div>
					</div>
					{errors.imageUrls?.message && <p className="text-xs font-semibold text-rose-700">{errors.imageUrls.message}</p>}
				</div>
			</div>
		</section>
	);
};

export default PostCreateMediaSection;
