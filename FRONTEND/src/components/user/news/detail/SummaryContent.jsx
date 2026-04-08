const normalizeSummaryText = (rawSummary) => {
	const text = String(rawSummary || '').trim();
	if (!text) return 'Nội dung tóm tắt đang được cập nhật.';

	// Support both escaped "\\n" and real newline characters from backend payloads.
	return text.replace(/\\n/g, '\n');
};

const SummaryContent = ({ summary, className = '' }) => {
	const normalized = normalizeSummaryText(summary);

	return <p className={className}>{normalized}</p>;
};

export default SummaryContent;