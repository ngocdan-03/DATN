import AppIcon from '../../components/common/AppIcon';

// Trang tam cho chuc nang dang tin trong khi cho backend flow day du.
const PostCreate = () => {
	return (
		<main className="mx-auto w-full max-w-4xl px-6 pb-20 pt-12 md:px-10">
			<section className="rounded-3xl border border-[#e4e2e3] bg-white p-8 text-center shadow-[0_22px_40px_-35px_rgba(4,22,39,0.45)] md:p-12">
				<div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff8ea] text-[#735c00]">
					<AppIcon name="plus" className="h-7 w-7" />
				</div>
				<h1 className="mt-5 text-3xl font-black text-[#041627] [font-family:Noto_Serif]">Đăng tin bất động sản</h1>
				<p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[#4a5059] md:text-base">
					Tính năng đăng tin đang được hoàn thiện. Bạn có thể liên hệ đội ngũ hỗ trợ để được mở tin thủ công trong giai đoạn này.
				</p>
			</section>
		</main>
	);
};

export default PostCreate;
