import SummaryContent from './SummaryContent';

// Doan mo dau tom tat cho bai viet.
const LeadSummary = ({ summary }) => {
	return (
		<section className="mb-16">
			<div className="relative">
				<div className="absolute -left-12 bottom-0 top-0 hidden w-1 bg-[#735c00]/30 md:block"></div>
				<SummaryContent
					summary={summary}
					className="whitespace-pre-line text-xl font-light leading-relaxed text-[#44474c] first-letter:float-left first-letter:mr-3 first-letter:text-6xl first-letter:font-bold first-letter:text-[#041627] first-letter:[font-family:Noto_Serif] md:text-2xl"
				/>
			</div>
		</section>
	);
};

export default LeadSummary;
