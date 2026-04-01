// Header editorial cho trang tin tuc.
const EditorialHeader = () => {
	return (
		<header className="relative mb-16 overflow-hidden rounded-3xl border border-[#cca830]/35 bg-[radial-gradient(circle_at_top_right,_rgba(204,168,48,0.24),_rgba(4,22,39,0.05)_38%,_rgba(251,249,250,1)_72%)] px-8 py-12 shadow-[0_30px_80px_-40px_rgba(4,22,39,0.55)] md:px-12">
			<div className="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full bg-[#cca830]/30 blur-2xl"></div>
			<div className="pointer-events-none absolute -bottom-12 left-16 h-28 w-28 rounded-full bg-[#041627]/10 blur-2xl"></div>
			<div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
				<div className="max-w-2xl">
					<span className="mb-4 inline-block rounded-full border border-[#cca830]/45 bg-white/75 px-4 py-1 text-sm font-semibold uppercase tracking-[0.2em] text-[#735c00]">
						Nhật ký & Góc nhìn
					</span>
					<h1 className="mb-6 bg-gradient-to-r from-[#041627] via-[#735c00] to-[#041627] bg-clip-text text-5xl leading-tight text-transparent [font-family:Noto_Serif] md:text-7xl">
						Chuyển động thị trường
						<br />
						& Nhịp sống ven biển.
					</h1>
					<p className="max-w-xl text-lg leading-relaxed text-[#44474c]">
						Góc nhìn tổng hợp về chuyển động thị trường bất động sản Đà Nẵng, từ pháp lý, hạ tầng đến xu hướng
						kiến trúc.
					</p>
				</div>
			</div>
			<div className="mt-10 h-[2px] w-full bg-gradient-to-r from-transparent via-[#cca830]/45 to-transparent"></div>
		</header>
	);
};

export default EditorialHeader;
