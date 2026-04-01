import AppIcon from '../../../common/AppIcon';

// Gallery hinh anh bai dang voi thumbnail va dieu huong qua lai.
const PostImageGallery = ({ images, activeImageIndex, onGoToImage }) => {
	return (
		<section className="rounded-3xl border border-[#e4e2e3] bg-white p-3 shadow-[0_22px_40px_-35px_rgba(4,22,39,0.45)]" data-component="ImageGallery">
			<div className="relative overflow-hidden rounded-2xl">
				<img alt="Ảnh chính bất động sản" className="h-[360px] w-full object-cover md:h-[520px]" src={images[activeImageIndex]} />
				<div className="pointer-events-none absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.5)_100%)] p-4">
					<p className="inline-flex items-center rounded-full bg-black/45 px-3 py-1 text-xs font-semibold text-white">
						{activeImageIndex + 1} / {images.length}
					</p>
				</div>
			</div>

			<div className="mt-3 flex items-center gap-2">
				<button
					type="button"
					onClick={() => onGoToImage(activeImageIndex - 1)}
					className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#d8dce4] bg-white text-[#2f3742] transition hover:border-[#041627]"
					aria-label="Ảnh trước"
				>
					<AppIcon name="chevronLeft" />
				</button>

				<div className="grid flex-1 grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
					{images.map((url, index) => {
						const isActive = index === activeImageIndex;
						return (
							<button
								key={`${url}-${index}`}
								type="button"
								onClick={() => onGoToImage(index)}
								className={`group relative overflow-hidden rounded-xl border ${
									isActive ? 'border-[#cca830] ring-2 ring-[#cca830]/30' : 'border-[#dde1e8]'
								}`}
							>
								<img alt={`Ảnh bất động sản ${index + 1}`} className="h-16 w-full object-cover sm:h-20 md:h-24" src={url} />
								{isActive && <span className="absolute inset-0 border-2 border-[#cca830]" />}
							</button>
						);
					})}
				</div>

				<button
					type="button"
					onClick={() => onGoToImage(activeImageIndex + 1)}
					className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#d8dce4] bg-white text-[#2f3742] transition hover:border-[#041627]"
					aria-label="Ảnh sau"
				>
					<AppIcon name="chevronRight" />
				</button>
			</div>
		</section>
	);
};

export default PostImageGallery;
