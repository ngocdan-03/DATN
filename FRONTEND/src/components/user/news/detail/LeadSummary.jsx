// Doan mo dau tom tat cho bai viet.
const LeadSummary = ({ summary }) => {
	return (
		<section className="mb-16">
			<div className="relative">
				<div className="absolute -left-12 bottom-0 top-0 hidden w-1 bg-[#735c00]/30 md:block"></div>
				<p className="text-xl font-light leading-relaxed text-[#44474c] first-letter:float-left first-letter:mr-3 first-letter:text-6xl first-letter:font-bold first-letter:text-[#041627] first-letter:[font-family:Noto_Serif] md:text-2xl">
					{summary || 'Nội dung tóm tắt đang được cập nhật.'}
				</p>
			</div>
		</section>
	);
};

export default LeadSummary;
